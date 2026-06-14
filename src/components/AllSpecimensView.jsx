import { useEffect, useState, useCallback } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { db } from '../lib/firebase'
import { STAGES, stageMeta } from '../lib/stages'

// Vista de solo lectura de todos los ejemplares (ciclo de vida) con su dueño,
// grupo, estado actual y última observación. Para el panel de admin.
export default function AllSpecimensView() {
  const navigate = useNavigate()
  const [specimens, setSpecimens] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [specimensSnap, logsSnap, usersSnap] = await Promise.all([
        getDocs(collection(db, 'specimens')),
        getDocs(collection(db, 'specimenLogs')),
        getDocs(collection(db, 'users')),
      ])

      const groupByUser = {}
      usersSnap.forEach((d) => { groupByUser[d.id] = d.data().group ?? '' })

      const lastBySpecimen = {}
      logsSnap.forEach((d) => {
        const log = { id: d.id, ...d.data() }
        const cur = lastBySpecimen[log.specimenId]
        const t = log.createdAt?.toMillis?.() ?? 0
        if (!cur || t > (cur.createdAt?.toMillis?.() ?? 0)) lastBySpecimen[log.specimenId] = log
      })

      const items = specimensSnap.docs
        .map((d) => {
          const sp = { id: d.id, ...d.data() }
          return {
            ...sp,
            _lastLog: lastBySpecimen[sp.id] ?? null,
            _group: groupByUser[sp.ownerId] ?? '',
          }
        })
        .sort((a, b) => (a.ownerName ?? '').localeCompare(b.ownerName ?? ''))

      setSpecimens(items)
    } catch (err) {
      console.error('Error cargando ejemplares:', err)
      setError('No se pudieron cargar los ejemplares. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const groups = [...new Set(specimens.map((s) => s._group).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b)
  )

  const filtered = specimens.filter((sp) => {
    const q = search.toLowerCase()
    const matchesSearch =
      sp.name?.toLowerCase().includes(q) ||
      sp.ownerName?.toLowerCase().includes(q) ||
      sp.hostPlantName?.toLowerCase().includes(q) ||
      sp._group?.toLowerCase().includes(q)
    const matchesGroup = !groupFilter || sp._group === groupFilter
    const matchesStage = !stageFilter || sp.stage === stageFilter
    return matchesSearch && matchesGroup && matchesStage
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">🦋 Ciclo de vida</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {specimens.length} ejemplar{specimens.length !== 1 ? 'es' : ''} de todos los estudiantes
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Buscar por ejemplar, estudiante, planta o grupo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-60 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todos los estados</option>
          {STAGES.map((s) => <option key={s.value} value={s.value}>{s.icon} {s.label}</option>)}
        </select>
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todos los grupos</option>
          {groups.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-4xl">🦋</span>
          <p className="text-gray-500 dark:text-gray-400 mt-3">
            {search || groupFilter || stageFilter ? 'Sin resultados' : 'Aún no hay ejemplares registrados'}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">Ejemplar</th>
                  <th className="px-4 py-3 text-left">Estudiante</th>
                  <th className="px-4 py-3 text-left">Grupo</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Última observación</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sp) => {
                  const meta = stageMeta(sp.stage)
                  const log = sp._lastLog
                  return (
                    <tr
                      key={sp.id}
                      onClick={() => navigate(`/ciclo/${sp.id}`)}
                      className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{sp.name}</p>
                        {sp.hostPlantName && <p className="text-xs text-gray-400">🌿 {sp.hostPlantName}</p>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{sp.ownerName || '—'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{sp._group || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.style}`}>
                          {meta.icon} {meta.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                        {log ? (
                          <span>
                            <span className="text-xs text-gray-400 mr-2">
                              {log.createdAt?.toDate?.().toLocaleDateString('es-CO') ?? '—'}
                            </span>
                            {log.count != null && <span>🔢 {log.count}</span>}
                          </span>
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
