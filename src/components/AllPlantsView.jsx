import { useEffect, useState, useCallback } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/firebase'

// Vista de solo lectura de todas las plantas (con su dueño, grupo, nº de
// registros y última observación). La reutilizan el panel de admin y la
// sección "Compañeros" de los estudiantes.
export default function AllPlantsView({ title, subtitle, showGroupFilter = false }) {
  const navigate = useNavigate()
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [plantsSnap, logsSnap, usersSnap] = await Promise.all([
        getDocs(collection(db, 'plants')),
        getDocs(collection(db, 'logs')),
        getDocs(collection(db, 'users')),
      ])

      const groupByUser = {}
      usersSnap.forEach((d) => { groupByUser[d.id] = d.data().group ?? '' })

      const logsByPlant = {}
      logsSnap.forEach((d) => {
        const log = { id: d.id, ...d.data() }
        ;(logsByPlant[log.plantId] ??= []).push(log)
      })

      const items = plantsSnap.docs
        .map((d) => {
          const plant = { id: d.id, ...d.data() }
          const plantLogs = logsByPlant[plant.id] ?? []
          plantLogs.sort(
            (a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)
          )
          return {
            ...plant,
            _logsCount: plantLogs.length,
            _lastLog: plantLogs[0] ?? null,
            _group: groupByUser[plant.ownerId] ?? '',
          }
        })
        .sort((a, b) => (a.ownerName ?? '').localeCompare(b.ownerName ?? ''))

      setPlants(items)
    } catch (err) {
      console.error('Error cargando plantas:', err)
      setError('No se pudieron cargar las plantas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const groups = [...new Set(plants.map((p) => p._group).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b)
  )

  const filtered = plants.filter((p) => {
    const q = search.toLowerCase()
    const matchesSearch =
      p.name?.toLowerCase().includes(q) ||
      p.type?.toLowerCase().includes(q) ||
      p.ownerName?.toLowerCase().includes(q) ||
      p._group?.toLowerCase().includes(q)
    const matchesGroup = !groupFilter || p._group === groupFilter
    return matchesSearch && matchesGroup
  })

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
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {plants.length} planta{plants.length !== 1 ? 's' : ''} · {subtitle}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Buscar por planta, especie, estudiante o grupo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-60 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        {showGroupFilter && (
          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todos los grupos</option>
            {groups.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-4xl">🌿</span>
          <p className="text-gray-500 dark:text-gray-400 mt-3">
            {search || groupFilter ? 'Sin resultados' : 'Aún no hay plantas registradas'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">Planta</th>
                  <th className="px-4 py-3 text-left">Estudiante</th>
                  <th className="px-4 py-3 text-left">Grupo</th>
                  <th className="px-4 py-3 text-center">Registros</th>
                  <th className="px-4 py-3 text-left">Última observación</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const log = p._lastLog
                  return (
                    <tr
                      key={p.id}
                      onClick={() => navigate(`/plants/${p.id}`)}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</p>
                        <p className="text-xs text-gray-400 italic">{p.type}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        {p.ownerName || '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        {p._group || '—'}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">
                        {p._logsCount}
                      </td>
                      <td className="px-4 py-3">
                        {log ? (
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-xs text-gray-400 mr-2">
                              {log.createdAt?.toDate?.().toLocaleDateString('es-CO') ?? '—'}
                            </span>
                            <span className="inline-flex flex-wrap gap-x-3">
                              {log.height != null && <span>📏 {log.height}cm</span>}
                              {log.leavesCount != null && <span>🍃 {log.leavesCount}</span>}
                              {log.flowersCount != null && <span>🌸 {log.flowersCount}</span>}
                              {log.eggsCount != null && <span>🥚 {log.eggsCount}</span>}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Sin registros</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
