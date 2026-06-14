import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const studentNav = [
  { to: '/dashboard', label: 'Inicio', icon: '🏠' },
  { to: '/plants', label: 'Mis plantas', icon: '🌿' },
  { to: '/register', label: 'Nuevo registro', icon: '📝' },
  { to: '/scores', label: 'Mis puntos', icon: '⭐' },
]

const adminNav = [
  { to: '/admin', label: 'Resumen', icon: '📊' },
  { to: '/admin/students', label: 'Estudiantes', icon: '👥' },
  { to: '/admin/plants', label: 'Plantas', icon: '🌿' },
  { to: '/admin/sensors', label: 'Sensores', icon: '🌡️' },
]

export default function Layout({ children }) {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = profile?.role === 'admin'
  const nav = isAdmin ? adminNav : studentNav

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🦋</span>
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">Metamorfosis</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {isAdmin ? '👑 Administrador' : '🎓 Estudiante'}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, label, icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <span>{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {profile?.displayName || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {profile?.email}
            </p>
            {!isAdmin && (
              <p className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold mt-1">
                ⭐ {profile?.points ?? 0} puntos
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            🚪 Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
