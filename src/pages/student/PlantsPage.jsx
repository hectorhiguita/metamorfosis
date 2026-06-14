import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const HEALTH_COLORS = {
  saludable: 'text-green-600 bg-green-50 dark:bg-green-900/20',
  regular: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20',
  enfermo: 'text-red-600 bg-red-50 dark:bg-red-900/20',
}

export default function PlantsPage() {
  const { user } = useAuth()
  const [plants, setPlants] = useState([])
  const [plantLogs, setPlantLogs] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const plantsSnap = await getDocs(
          query(collection(db, 'plants'), where('ownerId', '==', user.uid))
        )
        const plantList = plantsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        setPlants(plantList)

        // Obtener último log de cada planta.
        // Filtramos solo por plantId y ordenamos en el cliente para evitar
        // requerir un índice compuesto (plantId + createdAt) en Firestore.
        const logsMap = {}
        await Promise.all(
          plantList.map(async (plant) => {
            const snap = await getDocs(
              query(collection(db, 'logs'), where('plantId', '==', plant.id))
            )
            if (snap.empty) return
            const logs = snap.docs
              .map((d) => ({ id: d.id, ...d.data() }))
              .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
            logsMap[plant.id] = logs[0]
          })
        )
        setPlantLogs(logsMap)
      } catch (err) {
        console.error('Error cargando plantas:', err)
        setError('No se pudieron cargar las plantas. Intenta de nuevo.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis plantas</h1>
        <Link
          to="/register"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          + Nuevo registro
        </Link>
      </div>

      {plants.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-5xl">🌱</span>
          <p className="text-gray-500 dark:text-gray-400 mt-4">Aún no tienes plantas registradas</p>
          <Link
            to="/register"
            className="mt-4 inline-block px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg"
          >
            Registrar primera planta
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plants.map((plant) => {
            const lastLog = plantLogs[plant.id]
            return (
              <Link
                key={plant.id}
                to={`/plants/${plant.id}`}
                className="block bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 hover:border-green-400 dark:hover:border-green-600 hover:shadow-sm transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{plant.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 italic">{plant.type}</p>
                  </div>
                  <span className="text-2xl">🌿</span>
                </div>

                {lastLog ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${HEALTH_COLORS[lastLog.healthStatus] ?? ''}`}
                      >
                        {lastLog.healthStatus}
                      </span>
                      <span className="text-xs text-gray-400">
                        {lastLog.createdAt?.toDate?.().toLocaleDateString('es-CO')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-sm text-gray-600 dark:text-gray-300">
                      {lastLog.height != null && <span>📏 {lastLog.height} cm</span>}
                      {lastLog.leavesCount != null && <span>🍃 {lastLog.leavesCount}</span>}
                      {lastLog.flowersCount != null && <span>🌸 {lastLog.flowersCount}</span>}
                      {lastLog.eggsCount != null && <span>🥚 {lastLog.eggsCount}</span>}
                    </div>
                    {lastLog.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 italic">
                        "{lastLog.notes}"
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Sin registros aún</p>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
