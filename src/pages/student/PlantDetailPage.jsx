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
  Timestamp,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'

const POINTS_PER_FOLLOWUP = 10

// Fecha de hoy en formato yyyy-mm-dd respetando la zona horaria local.
function todayStr() {
  const d = new Date()
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

const emptyForm = () => ({
  date: todayStr(),
  height: '',
  leavesCount: '',
  flowersCount: '',
  eggsCount: '',
})

export default function PlantDetailPage() {
  const { plantId } = useParams()
  const { user, profile } = useAuth()
  const isAdmin = profile?.role === 'admin'
  const backTo = isAdmin ? '/admin/plants' : '/plants'

  const [plant, setPlant] = useState(null)
  const [logs, setLogs] = useState([])
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
      const plantSnap = await getDoc(doc(db, 'plants', plantId))
      // El admin puede ver cualquier planta; el estudiante solo las suyas.
      if (!plantSnap.exists() || (!isAdmin && plantSnap.data().ownerId !== user.uid)) {
        setError('Planta no encontrada.')
        return
      }
      setPlant({ id: plantSnap.id, ...plantSnap.data() })

      // Filtramos por plantId y ordenamos en el cliente para no requerir
      // un índice compuesto (plantId + createdAt) en Firestore.
      const logsSnap = await getDocs(
        query(collection(db, 'logs'), where('plantId', '==', plantId))
      )
      const items = logsSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
      setLogs(items)
    } catch (err) {
      console.error('Error cargando la planta:', err)
      setError('No se pudo cargar la planta. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [user, plantId, isAdmin])

  useEffect(() => { fetchData() }, [fetchData])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user || !plant) return
    setFormError('')
    if (!form.date) {
      setFormError('Elige la fecha del seguimiento.')
      return
    }
    setSaving(true)
    try {
      // La fecha elegida se guarda en createdAt (al mediodía local para evitar
      // saltos de día por zona horaria), así el historial y los demás módulos
      // ordenan por la fecha de observación.
      const [y, m, d] = form.date.split('-').map(Number)
      const observedAt = Timestamp.fromDate(new Date(y, m - 1, d, 12, 0, 0))

      await addDoc(collection(db, 'logs'), {
        plantId: plant.id,
        plantName: plant.name,
        ownerId: user.uid,
        ownerName: profile?.displayName ?? '',
        height: form.height ? parseFloat(form.height) : null,
        leavesCount: form.leavesCount ? parseInt(form.leavesCount) : null,
        flowersCount: form.flowersCount ? parseInt(form.flowersCount) : null,
        eggsCount: form.eggsCount ? parseInt(form.eggsCount) : null,
        isFollowUp: true,
        pointsEarned: POINTS_PER_FOLLOWUP,
        createdAt: observedAt,
        recordedAt: serverTimestamp(),
      })

      // Sumar puntos al usuario (merge crea el perfil si no existiera).
      await setDoc(
        doc(db, 'users', user.uid),
        { points: increment(POINTS_PER_FOLLOWUP) },
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
        <Link to={backTo} className="text-sm text-green-600 hover:underline">← Volver</Link>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link to={backTo} className="text-sm text-gray-500 hover:text-green-600 transition-colors">
        ← {isAdmin ? 'Plantas' : 'Mis plantas'}
      </Link>

      {/* Encabezado de la planta */}
      <div className="flex items-start justify-between mt-3 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌿</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{plant.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">{plant.type}</p>
            {isAdmin && plant.ownerName && (
              <p className="text-xs text-gray-400 mt-0.5">👤 {plant.ownerName}</p>
            )}
          </div>
        </div>
        {!isAdmin && (
          <button
            onClick={() => { setShowForm((s) => !s); setFormError('') }}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            {showForm ? 'Cancelar' : '+ Agregar seguimiento'}
          </button>
        )}
      </div>

      {/* Formulario de seguimiento */}
      {!isAdmin && showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-6 space-y-4"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white">Nuevo seguimiento</h2>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Fecha del seguimiento</label>
            <input
              type="date"
              required
              max={todayStr()}
              value={form.date}
              onChange={set('date')}
              className="w-full sm:w-48 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">📏 Tamaño (cm)</label>
              <input
                type="number" step="0.1" min="0" placeholder="0.0"
                value={form.height} onChange={set('height')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">🍃 Hojas</label>
              <input
                type="number" min="0" placeholder="0"
                value={form.leavesCount} onChange={set('leavesCount')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">🌸 Flores</label>
              <input
                type="number" min="0" placeholder="0"
                value={form.flowersCount} onChange={set('flowersCount')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">🥚 Huevos</label>
              <input
                type="number" min="0" placeholder="0"
                value={form.eggsCount} onChange={set('eggsCount')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
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
            {saving ? 'Guardando...' : `Guardar seguimiento (+${POINTS_PER_FOLLOWUP} pts)`}
          </button>
        </form>
      )}

      {/* Historial */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        Historial <span className="text-sm font-normal text-gray-400">({logs.length})</span>
      </h2>

      {logs.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
          Aún no hay observaciones. Agrega el primer seguimiento.
        </p>
      ) : (
        <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-2">
          {logs.map((log) => (
            <li key={log.id} className="mb-5 ml-5">
              <span className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-green-500" />
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  {log.createdAt?.toDate?.().toLocaleDateString('es-CO', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  }) ?? '—'}
                  {!log.isFollowUp && (
                    <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      registro inicial
                    </span>
                  )}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <span>📏 {log.height != null ? `${log.height} cm` : '—'}</span>
                  <span>🍃 {log.leavesCount ?? 0}</span>
                  <span>🌸 {log.flowersCount ?? 0}</span>
                  <span>🥚 {log.eggsCount ?? 0}</span>
                </div>
                {log.notes && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 italic">"{log.notes}"</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}
