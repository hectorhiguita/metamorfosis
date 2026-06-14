import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../lib/firebase'

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 text-center">
      <div className="text-4xl mb-2">{icon}</div>
      <p className={`text-3xl font-bold ${accent}`}>{value}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</p>
    </div>
  )
}

export default function PublicDashboard() {
  const [stats, setStats] = useState(null)
  const [species, setSpecies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [plantsSnap, logsSnap] = await Promise.all([
          getDocs(collection(db, 'plants')),
          getDocs(collection(db, 'logs')),
        ])
        const plants = plantsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))
        const logs = logsSnap.docs.map((d) => d.data())

        // Estudiantes participantes = dueños distintos con al menos una planta.
        const students = new Set(plants.map((p) => p.ownerId).filter(Boolean)).size

        // Conteos "actuales": tomamos la última observación de cada planta.
        const latestByPlant = {}
        logs.forEach((l) => {
          const cur = latestByPlant[l.plantId]
          const t = l.createdAt?.toMillis?.() ?? 0
          if (!cur || t > (cur.createdAt?.toMillis?.() ?? 0)) latestByPlant[l.plantId] = l
        })
        const latest = Object.values(latestByPlant)
        const sum = (key) => latest.reduce((acc, l) => acc + (Number(l[key]) || 0), 0)

        setStats({
          plants: plants.length,
          students,
          observations: logs.length,
          leaves: sum('leavesCount'),
          flowers: sum('flowersCount'),
          eggs: sum('eggsCount'),
        })

        // Distribución por especie.
        const byType = {}
        plants.forEach((p) => { byType[p.type ?? 'Otra'] = (byType[p.type ?? 'Otra'] ?? 0) + 1 })
        setSpecies(
          Object.entries(byType)
            .map(([type, count]) => ({ type, count }))
            .sort((a, b) => b.count - a.count)
        )
      } catch (err) {
        console.error('Error cargando estadísticas públicas:', err)
        setError('No se pudieron cargar las estadísticas.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const maxSpecies = species.reduce((m, s) => Math.max(m, s.count), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-950 dark:to-emerald-950">
      {/* Encabezado */}
      <header className="max-w-5xl mx-auto px-6 pt-12 pb-8 text-center">
        <div className="text-6xl mb-3">🦋</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">Metamorfosis</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-xl mx-auto">
          Proyecto escolar de registro de plantas hospederas de mariposas. Estos son los
          resultados del trabajo de nuestros estudiantes.
        </p>
        <Link
          to="/login"
          className="inline-block mt-5 px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Ingresar al portal
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 pb-16">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center text-gray-600 dark:text-gray-300 py-12">{error}</p>
        ) : (
          <>
            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard icon="🌿" label="Plantas registradas" value={stats.plants} accent="text-green-600 dark:text-green-400" />
              <StatCard icon="👥" label="Estudiantes participantes" value={stats.students} accent="text-blue-600 dark:text-blue-400" />
              <StatCard icon="📝" label="Observaciones" value={stats.observations} accent="text-gray-700 dark:text-gray-200" />
              <StatCard icon="🍃" label="Hojas (último registro)" value={stats.leaves} accent="text-emerald-600 dark:text-emerald-400" />
              <StatCard icon="🌸" label="Flores (último registro)" value={stats.flowers} accent="text-pink-600 dark:text-pink-400" />
              <StatCard icon="🥚" label="Huevos (último registro)" value={stats.eggs} accent="text-amber-600 dark:text-amber-400" />
            </div>

            {/* Distribución por especie */}
            {species.length > 0 && (
              <div className="mt-8 bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4">🌱 Plantas por especie</h2>
                <div className="space-y-3">
                  {species.map((s) => (
                    <div key={s.type}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 dark:text-gray-300 italic">{s.type}</span>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">{s.count}</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full"
                          style={{ width: `${maxSpecies ? (s.count / maxSpecies) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Próximamente: ciclo de vida */}
            <div className="mt-8 bg-white/60 dark:bg-gray-900/60 rounded-2xl p-6 border border-dashed border-gray-300 dark:border-gray-700 text-center">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Próximamente</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Seguimiento del ciclo completo de la mariposa
              </p>
              <div className="flex items-center justify-center gap-2 sm:gap-4 text-2xl sm:text-3xl">
                <span title="Huevo">🥚</span>
                <span className="text-gray-300 dark:text-gray-600">→</span>
                <span title="Oruga">🐛</span>
                <span className="text-gray-300 dark:text-gray-600">→</span>
                <span title="Crisálida">🛡️</span>
                <span className="text-gray-300 dark:text-gray-600">→</span>
                <span title="Mariposa">🦋</span>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="text-center text-xs text-gray-400 dark:text-gray-600 pb-8">
        Proyecto Metamorfosis · Datos actualizados en tiempo real
      </footer>
    </div>
  )
}
