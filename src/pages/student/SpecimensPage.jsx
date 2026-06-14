import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  setDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import { STAGES, stageMeta } from '../../lib/stages'
import { todayStr, dateStrToTimestamp } from '../../lib/dates'

const POINTS_NEW_SPECIMEN = 15

const emptyForm = () => ({
  name: '',
  hostPlantId: '',
  stage: 'huevo',
  count: '',
  date: todayStr(),
  notes: '',
})

export default function SpecimensPage() {
  const { user, profile } = useAuth()
  const [specimens, setSpecimens] = useState([])
  const [plants, setPlants] = useState([])
  const [lastLogs, setLastLogs] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const [specimensSnap, logsSnap, plantsSnap] = await Promise.all([
        getDocs(query(collection(db, 'specimens'), where('ownerId', '==', user.uid))),
        getDocs(query(collection(db, 'specimenLogs'), where('ownerId', '==', user.uid))),
        getDocs(query(collection(db, 'plants'), where('ownerId', '==', user.uid))),
      ])

      setSpecimens(specimensSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setPlants(plantsSnap.docs.map((d) => ({ id: d.id, ...d.data() })))

      // Última observación por ejemplar (orden en cliente, sin índice compuesto).
      const bySpecimen = {}
      logsSnap.forEach((d) => {
        const log = { id: d.id, ...d.data() }
        const cur = bySpecimen[log.specimenId]
        const t = log.createdAt?.toMillis?.() ?? 0
        if (!cur || t > (cur.createdAt?.toMillis?.() ?? 0)) bySpecimen[log.specimenId] = log
      })
      setLastLogs(bySpecimen)
    } catch (err) {
      console.error('Error cargando ejemplares:', err)
      setError('No se pudieron cargar los ejemplares. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { fetchData() }, [fetchData])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!user) return
    setFormError('')
    if (!form.name.trim()) { setFormError('Ponle un identificador al ejemplar.'); return }
    if (!form.date) { setFormError('Elige la fecha del registro.'); return }
    setSaving(true)
    try {
      const plant = plants.find((p) => p.id === form.hostPlantId)
      const observedAt = dateStrToTimestamp(form.date)

      const specimenRef = await addDoc(collection(db, 'specimens'), {
        name: form.name.trim(),
        ownerId: user.uid,
        ownerName: profile?.displayName ?? '',
        hostPlantId: form.hostPlantId || null,
        hostPlantName: plant?.name ?? null,
        stage: form.stage,
        createdAt: serverTimestamp(),
      })

      await addDoc(collection(db, 'specimenLogs'), {
        specimenId: specimenRef.id,
        specimenName: form.name.trim(),
        ownerId: user.uid,
        ownerName: profile?.displayName ?? '',
        stage: form.stage,
        count: form.count ? parseInt(form.count) : null,
        size: null,
        notes: form.notes,
        isInitial: true,
        stageChanged: false,
        previousStage: null,
        pointsEarned: POINTS_NEW_SPECIMEN,
        createdAt: observedAt,
        recordedAt: serverTimestamp(),
      })

      await setDoc(
        doc(db, 'users', user.uid),
        { points: increment(POINTS_NEW_SPECIMEN) },
        { merge: true }
      )

      setForm(emptyForm())
      setShowForm(false)
      await fetchData()
    } catch (err) {
      console.error(err)
      setFormError(`No se pudo guardar: ${err.code ?? ''} ${err.message ?? err}`)
    } finally {
      setSaving(false)
    }
  }

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
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🦋 Ciclo de vida</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Mis ejemplares en seguimiento</p>
        </div>
        <button
          onClick={() => { setShowForm((s) => !s); setFormError('') }}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {showForm ? 'Cancelar' : '+ Nuevo ejemplar'}
        </button>
      </div>

      {/* Formulario de nuevo ejemplar */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-6 space-y-4"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white">Nuevo ejemplar</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Identificador</label>
              <input
                required
                placeholder="Ej. Lote A1"
                value={form.name}
                onChange={set('name')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Planta hospedera (opcional)</label>
              <select
                value={form.hostPlantId}
                onChange={set('hostPlantId')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Sin planta asociada</option>
                {plants.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.type})</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Estado inicial</label>
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
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Cantidad</label>
              <input
                type="number" min="0" placeholder="0"
                value={form.count} onChange={set('count')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Fecha</label>
              <input
                type="date" required max={todayStr()}
                value={form.date} onChange={set('date')}
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
            {saving ? 'Guardando...' : `Crear ejemplar (+${POINTS_NEW_SPECIMEN} pts)`}
          </button>
        </form>
      )}

      {specimens.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl">🦋</span>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Aún no tienes ejemplares en seguimiento</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {specimens.map((sp) => {
            const meta = stageMeta(sp.stage)
            const last = lastLogs[sp.id]
            return (
              <Link
                key={sp.id}
                to={`/ciclo/${sp.id}`}
                className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-green-400 dark:hover:border-green-600 hover:shadow-sm transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{sp.name}</p>
                    {sp.hostPlantName && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">🌿 {sp.hostPlantName}</p>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.style}`}>
                    {meta.icon} {meta.label}
                  </span>
                </div>
                {last ? (
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                    {last.count != null && <span>🔢 {last.count}</span>}
                    <span className="text-xs text-gray-400">
                      {last.createdAt?.toDate?.().toLocaleDateString('es-CO')}
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Sin observaciones</p>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
