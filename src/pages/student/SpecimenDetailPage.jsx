import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  setDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import { STAGES, stageMeta } from '../../lib/stages'
import { todayStr, dateStrToTimestamp } from '../../lib/dates'

const POINTS_FOLLOWUP = 10
const POINTS_STAGE_CHANGE = 5

const emptyForm = (stage) => ({
  date: todayStr(),
  stage: stage ?? 'huevo',
  count: '',
  size: '',
  notes: '',
})

export default function SpecimenDetailPage() {
  const { specimenId } = useParams()
  const { user, profile } = useAuth()
  const isAdmin = profile?.role === 'admin'

  const [specimen, setSpecimen] = useState(null)
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const snap = await getDoc(doc(db, 'specimens', specimenId))
      if (!snap.exists()) {
        setError('Ejemplar no encontrado.')
        return
      }
      const sp = { id: snap.id, ...snap.data() }
      setSpecimen(sp)
      setForm(emptyForm(sp.stage))

      const logsSnap = await getDocs(
        query(collection(db, 'specimenLogs'), where('specimenId', '==', specimenId))
      )
      const items = logsSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
      setLogs(items)
    } catch (err) {
      console.error('Error cargando el ejemplar:', err)
      setError('No se pudo cargar el ejemplar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [user, specimenId])

  useEffect(() => { fetchData() }, [fetchData])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !specimen) return
    setFormError('')
    if (!form.date) { setFormError('Elige la fecha del seguimiento.'); return }
    setSaving(true)
    try {
      const prevStage = specimen.stage
      const stageChanged = form.stage !== prevStage
      const points = POINTS_FOLLOWUP + (stageChanged ? POINTS_STAGE_CHANGE : 0)

      await addDoc(collection(db, 'specimenLogs'), {
        specimenId: specimen.id,
        specimenName: specimen.name,
        ownerId: user.uid,
        ownerName: profile?.displayName ?? '',
        stage: form.stage,
        count: form.count ? parseInt(form.count) : null,
        size: form.size ? parseFloat(form.size) : null,
        notes: form.notes,
        isInitial: false,
        stageChanged,
        previousStage: stageChanged ? prevStage : null,
        pointsEarned: points,
        createdAt: dateStrToTimestamp(form.date),
        recordedAt: serverTimestamp(),
      })

      // Actualizar el estado actual del ejemplar.
      await setDoc(doc(db, 'specimens', specimen.id), { stage: form.stage }, { merge: true })

      await setDoc(
        doc(db, 'users', user.uid),
        { points: increment(points) },
        { merge: true }
      )

      setForm(emptyForm(form.stage))
      setShowForm(false)
      await fetchData()
    } catch (err) {
      console.error(err)
      setFormError(`No se pudo guardar: ${err.code ?? ''} ${err.message ?? err}`)
    } finally {
      setSaving(false)
    }
  }

  const isOwner = !!specimen && specimen.ownerId === user?.uid
  const backTo = isAdmin ? '/admin/ciclo' : '/ciclo'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
        <span className="text-4xl">⚠️</span>
        <p className="text-gray-600 dark:text-gray-300">{error}</p>
        <Link to={backTo} className="text-sm text-green-600 hover:underline">← Volver</Link>
      </div>
    )
  }

  const meta = stageMeta(specimen.stage)

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link to={backTo} className="text-sm text-gray-500 hover:text-green-600 transition-colors">
        ← {isAdmin ? 'Ciclo de vida' : 'Mis ejemplares'}
      </Link>

      {/* Encabezado */}
      <div className="flex items-start justify-between mt-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{meta.icon}</span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{specimen.name}</h1>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.style}`}>
                {meta.label}
              </span>
            </div>
            {specimen.hostPlantName && (
              <p className="text-sm text-gray-500 dark:text-gray-400">🌿 {specimen.hostPlantName}</p>
            )}
            {!isOwner && specimen.ownerName && (
              <p className="text-xs text-gray-400 mt-0.5">👤 {specimen.ownerName}</p>
            )}
          </div>
        </div>
        {isOwner && (
          <button
            onClick={() => { setShowForm((s) => !s); setFormError('') }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Agregar seguimiento'}
          </button>
        )}
      </div>

      {/* Progreso de estados */}
      <div className="flex items-center justify-center gap-1 sm:gap-2 mb-6 text-xl sm:text-2xl">
        {STAGES.map((s, i) => {
          const reached = STAGES.findIndex((x) => x.value === specimen.stage) >= i
          return (
            <span key={s.value} className="flex items-center gap-1 sm:gap-2">
              <span className={reached ? '' : 'opacity-25 grayscale'} title={s.label}>{s.icon}</span>
              {i < STAGES.length - 1 && <span className="text-gray-300 dark:text-gray-600 text-sm">→</span>}
            </span>
          )
        })}
      </div>

      {/* Formulario de seguimiento (solo el dueño) */}
      {isOwner && showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-6 space-y-4"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white">Nuevo seguimiento</h2>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Estado actual</label>
            <div className="flex gap-2 flex-wrap">
              {STAGES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, stage: s.value }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    form.stage === s.value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
            {form.stage !== specimen.stage && (
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                Se registrará el cambio: {stageMeta(specimen.stage).icon} {stageMeta(specimen.stage).label} → {stageMeta(form.stage).icon} {stageMeta(form.stage).label} (+{POINTS_STAGE_CHANGE} pts)
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Fecha</label>
              <input
                type="date" required max={todayStr()}
                value={form.date} onChange={set('date')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">🔢 Cantidad</label>
              <input
                type="number" min="0" placeholder="0"
                value={form.count} onChange={set('count')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">📏 Tamaño (cm)</label>
              <input
                type="number" step="0.1" min="0" placeholder="0.0"
                value={form.size} onChange={set('size')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Notas (opcional)</label>
            <textarea
              rows={2}
              value={form.notes} onChange={set('notes')}
              placeholder="Observaciones..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {formError && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors"
          >
            {saving ? 'Guardando...' : `Guardar seguimiento (+${POINTS_FOLLOWUP} pts)`}
          </button>
        </form>
      )}

      {/* Historial */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Historial <span className="text-sm font-normal text-gray-400">({logs.length})</span>
      </h2>

      {logs.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
          Aún no hay observaciones.
        </p>
      ) : (
        <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-2">
          {logs.map((log) => {
            const lm = stageMeta(log.stage)
            return (
              <li key={log.id} className="mb-5 ml-5">
                <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-green-500" />
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lm.style}`}>
                      {lm.icon} {lm.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {log.createdAt?.toDate?.().toLocaleDateString('es-CO', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      }) ?? '—'}
                    </span>
                  </div>

                  {log.stageChanged && log.previousStage && (
                    <p className="text-xs text-green-600 dark:text-green-400 mb-1.5">
                      ✨ Cambió de {stageMeta(log.previousStage).icon} {stageMeta(log.previousStage).label} a {lm.icon} {lm.label}
                    </p>
                  )}
                  {log.isInitial && (
                    <p className="text-[10px] inline-block px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 mb-1.5">
                      registro inicial
                    </p>
                  )}

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700 dark:text-gray-300">
                    {log.count != null && <span>🔢 {log.count}</span>}
                    {log.size != null && <span>📏 {log.size} cm</span>}
                  </div>
                  {log.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 italic">"{log.notes}"</p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
