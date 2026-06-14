import { useEffect, useState } from 'react'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'

export default function ScoresPage() {
  const { user, profile } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    getDocs(
      query(collection(db, 'logs'), where('ownerId', '==', user.uid), orderBy('createdAt', 'desc'))
    ).then((snap) => {
      setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
  }, [user])

  const totalPoints = profile?.points ?? 0
  const level = totalPoints < 100 ? 'Semilla 🌱' : totalPoints < 300 ? 'Brote 🌿' : totalPoints < 600 ? 'Plántula 🌾' : 'Mariposa 🦋'

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Mis puntos</h1>

      {/* Resumen */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white mb-6">
        <p className="text-sm opacity-80">Tu nivel actual</p>
        <p className="text-3xl font-bold mt-1">{level}</p>
        <p className="text-4xl font-black mt-2">⭐ {totalPoints}</p>
        <p className="text-sm opacity-80 mt-1">puntos totales</p>
      </div>

      {/* Cómo ganar puntos */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-3">¿Cómo ganar puntos?</h2>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex items-center gap-2">✅ <span>Registro base: <strong>+10 pts</strong></span></li>
          <li className="flex items-center gap-2">📸 <span>Incluir foto: <strong>+15 pts</strong></span></li>
          <li className="flex items-center gap-2">📝 <span>Agregar observaciones: <strong>+5 pts</strong></span></li>
        </ul>
      </div>

      {/* Historial */}
      <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Historial</h2>
      {logs.length === 0 ? (
        <p className="text-gray-400 text-sm">Aún no tienes registros</p>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{log.plantName}</p>
                <p className="text-xs text-gray-400">
                  {log.createdAt?.toDate?.().toLocaleDateString('es-CO', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </p>
              </div>
              <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
                +{log.pointsEarned ?? 0} pts
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
