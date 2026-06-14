import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [plants, setPlants] = useState([])
  const [recentLogs, setRecentLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const fetchData = async () => {
      const plantsSnap = await getDocs(
        query(collection(db, 'plants'), where('ownerId', '==', user.uid))
      )
      setPlants(plantsSnap.docs.map((d) => ({ id: d.id, ...d.data() })))

      const logsSnap = await getDocs(
        query(
          collection(db, 'logs'),
          where('ownerId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(5)
        )
      )
      setRecentLogs(logsSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Hola, {profile?.displayName?.split(' ')[0] ?? 'estudiante'} 👋
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Aquí tienes el resumen de tu trabajo
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="🌿" label="Mis plantas" value={plants.length} />
        <StatCard icon="📝" label="Registros" value={recentLogs.length} sub="últimos 5" />
        <StatCard icon="⭐" label="Puntos totales" value={profile?.points ?? 0} />
      </div>

      {/* Acceso rápido */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Link
          to="/register"
          className="flex items-center gap-4 p-5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors"
        >
          <span className="text-3xl">📝</span>
          <div>
            <p className="font-semibold">Nuevo registro</p>
            <p className="text-sm text-green-200">Registra el crecimiento de una planta</p>
          </div>
        </Link>
        <Link
          to="/plants"
          className="flex items-center gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-400 rounded-xl transition-colors"
        >
          <span className="text-3xl">🌿</span>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Ver mis plantas</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {plants.length} planta{plants.length !== 1 ? 's' : ''} registrada{plants.length !== 1 ? 's' : ''}
            </p>
          </div>
        </Link>
      </div>

      {/* Registros recientes */}
      {recentLogs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Registros recientes
          </h2>
          <div className="space-y-2">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {log.plantName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {log.createdAt?.toDate?.().toLocaleDateString('es-CO') ?? '—'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {log.height ? `📏 ${log.height} cm` : ''}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400">+{log.pointsEarned ?? 0} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
