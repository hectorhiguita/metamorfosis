import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../../lib/firebase'

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, plants: 0, logs: 0 })
  const [recentLogs, setRecentLogs] = useState([])
  const [topStudents, setTopStudents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      const [usersSnap, plantsSnap, logsSnap, recentSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'plants')),
        getDocs(collection(db, 'logs')),
        getDocs(query(collection(db, 'logs'), orderBy('createdAt', 'desc'), limit(10))),
      ])

      const students = usersSnap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .filter((u) => u.role === 'student')
        .sort((a, b) => (b.points ?? 0) - (a.points ?? 0))

      setStats({
        students: students.length,
        plants: plantsSnap.size,
        logs: logsSnap.size,
      })
      setTopStudents(students.slice(0, 5))
      setRecentLogs(recentSnap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    fetchAll()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Panel de administración</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Vista general del proyecto Metamorfosis</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon="👥" label="Estudiantes" value={stats.students} />
        <StatCard icon="🌿" label="Plantas registradas" value={stats.plants} />
        <StatCard icon="📝" label="Registros totales" value={stats.logs} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking de estudiantes */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">🏆 Ranking de estudiantes</h2>
          <div className="space-y-2">
            {topStudents.length === 0 && (
              <p className="text-sm text-gray-400">Sin estudiantes aún</p>
            )}
            {topStudents.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][i]}</span>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{s.displayName}</p>
                </div>
                <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                  ⭐ {s.points ?? 0}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Registros recientes */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">📋 Registros recientes</h2>
          <div className="space-y-2">
            {recentLogs.length === 0 && (
              <p className="text-sm text-gray-400">Sin registros aún</p>
            )}
            {recentLogs.map((log) => (
              <div key={log.id} className="py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{log.plantName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{log.ownerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {log.createdAt?.toDate?.().toLocaleDateString('es-CO') ?? '—'}
                    </p>
                    {log.imageUrl && <span className="text-xs text-blue-500">📸</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
