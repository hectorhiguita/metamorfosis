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
import { todayStr, dateStrToTimestamp } from '../../lib/dates'

const GARDEN_TYPES = [
  'Tomate',
  'Cebolla',
  'Calabaza',
  'Pepino',
  'Lechuga',
  'Zanahoria',
  'Pimentón',
  'Ají',
  'Cilantro',
  'Espinaca',
  'Acelga',
  'Rábano',
  'Fresa',
  'Frijol',
  'Maíz',
  'Papa',
  'Hierbabuena',
  'Otra',
]

const POINTS_NEW_GARDEN = 10

const emptyForm = () => ({
  name: '',
  type: GARDEN_TYPES[0],
  date: todayStr(),
  height: '',
  leavesCount: '',
  flowersCount: '',
  fruitsCount: '',
  notes: '',
})

export default function GardenPage() {
  const { user, profile } = useAuth()
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
      const [plantsSnap, logsSnap] = await Promise.all([
        getDocs(query(collection(db, 'garden'), where('ownerId', '==', user.uid))),
        getDocs(query(collection(db, 'gardenLogs'), where('ownerId', '==', user.uid))),
      ])
      setPlants(plantsSnap.docs.map((d) => ({ id: d.id, ...d.data() })))

      const bySpecimen = {}
      logsSnap.forEach((d) => {
        const log = { id: d.id, ...d.data() }
        const cur = bySpecimen[log.gardenId]
        const t = log.createdAt?.toMillis?.() ?? 0
        if (!cur || t > (cur.createdAt?.toMillis?.() ?? 0)) bySpecimen[log.gardenId] = log
      })
      setLastLogs(bySpecimen)
    } catch (err) {
      console.error('Error cargando la huerta:', err)
      setError('No se pudo cargar la huerta. Intenta de nuevo.')
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
    if (!form.name.trim()) { setFormError('Ponle un nombre o código a la planta.'); return }
    if (!form.date) { setFormError('Elige la fecha del registro.'); return }
    setSaving(true)
    try {
      const observedAt = dateStrToTimestamp(form.date)
      const gardenRef = await addDoc(collection(db, 'garden'), {
        name: form.name.trim(),
        type: form.type,
        ownerId: user.uid,
        ownerName: profile?.displayName ?? '',
        createdAt: serverTimestamp(),
      })

      await addDoc(collection(db, 'gardenLogs'), {
        gardenId: gardenRef.id,
        gardenName: form.name.trim(),
        ownerId: user.uid,
        ownerName: profile?.displayName ?? '',
        height: form.height ? parseFloat(form.height) : null,
        leavesCount: form.leavesCount ? parseInt(form.leavesCount) : null,
        flowersCount: form.flowersCount ? parseInt(form.flowersCount) : null,
        fruitsCount: form.fruitsCount ? parseInt(form.fruitsCount) : null,
        notes: form.notes,
        isInitial: true,
        pointsEarned: POINTS_NEW_GARDEN,
        createdAt: observedAt,
        recordedAt: serverTimestamp(),
      })

      await setDoc(
        doc(db, 'users', user.uid),
        { points: increment(POINTS_NEW_GARDEN) },
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🥕 Mi huerta</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Plantas de jardín en seguimiento</p>
        </div>
        <button
          onClick={() => { setShowForm((s) => !s); setFormError('') }}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {showForm ? 'Cancelar' : '+ Nueva planta'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-6 space-y-4"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white">Nueva planta de huerta</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Nombre o código</label>
              <input
                required
                placeholder="Ej. Tomate cama 1"
                value={form.name}
                onChange={set('name')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Tipo de planta</label>
              <select
                value={form.type}
                onChange={set('type')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {GARDEN_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Fecha</label>
              <input
                type="date" required max={todayStr()}
                value={form.date} onChange={set('date')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">📏 Altura</label>
              <input type="number" step="0.1" min="0" placeholder="cm" value={form.height} onChange={set('height')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">🍃 Hojas</label>
              <input type="number" min="0" placeholder="0" value={form.leavesCount} onChange={set('leavesCount')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">🌸 Flores</label>
              <input type="number" min="0" placeholder="0" value={form.flowersCount} onChange={set('flowersCount')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">🍅 Frutos</label>
              <input type="number" min="0" placeholder="0" value={form.fruitsCount} onChange={set('fruitsCount')}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
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
            {saving ? 'Guardando...' : `Crear planta (+${POINTS_NEW_GARDEN} pts)`}
          </button>
        </form>
      )}

      {plants.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl">🥕</span>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Aún no tienes plantas de huerta</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plants.map((p) => {
            const last = lastLogs[p.id]
            return (
              <Link
                key={p.id}
                to={`/huerta/${p.id}`}
                className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-green-400 dark:hover:border-green-600 hover:shadow-sm transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{p.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.type}</p>
                  </div>
                  <span className="text-2xl">🥕</span>
                </div>
                {last ? (
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-gray-600 dark:text-gray-300">
                    {last.height != null && <span>📏 {last.height} cm</span>}
                    {last.leavesCount != null && <span>🍃 {last.leavesCount}</span>}
                    {last.flowersCount != null && <span>🌸 {last.flowersCount}</span>}
                    {last.fruitsCount != null && <span>🍅 {last.fruitsCount}</span>}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Sin registros</p>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
