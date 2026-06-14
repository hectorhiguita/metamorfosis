import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
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

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      const plantsSnap = await getDocs(
        query(collection(db, 'plants'), where('ownerId', '==', user.uid))
      )
      const plantList = plantsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setPlants(plantList)

      // Obtener último log de cada planta
      const logsMap = {}
      await Promise.all(
        plantList.map(async (plant) => {
          const snap = await getDocs(
            query(
              collection(db, 'logs'),
              where('plantId', '==', plant.id),
              orderBy('createdAt', 'desc'),
              limit(1)
            )
          )
          if (!snap.empty) logsMap[plant.id] = { id: snap.docs[0].id, ...snap.docs[0].data() }
        })
      )
      setPlantLogs(logsMap)
      setLoading(false)
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
              <div
                key={plant.id}
                className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5"
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
                    {lastLog.height && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">📏 {lastLog.height} cm</p>
                    )}
                    {lastLog.leavesCount && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">🍃 {lastLog.leavesCount} hojas</p>
                    )}
                    {lastLog.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 italic">
                        "{lastLog.notes}"
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400">Sin registros aún</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
