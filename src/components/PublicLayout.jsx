import { Link, useLocation } from 'react-router-dom'

const TABS = [
  { to: '/', label: 'Inicio' },
  { to: '/conoce', label: 'Conoce Metamorfosis' },
  { to: '/jardin', label: 'Explora el Jardín Vivo' },
  { to: '/mariposas', label: 'Nuestras Mariposas' },
]

const CREDITS = [
  'Fotografías del jardín: proyecto Metamorfosis · IE República de Brasil',
  'Ciclo de vida y especies (referencia): Wikimedia Commons (CC0 / CC BY / CC BY-SA / GFDL)',
]

export default function PublicLayout({ children }) {
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Barra de pestañas */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center gap-4 h-14">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🦋</span>
            <span className="font-bold text-gray-900 dark:text-white hidden sm:inline">Metamorfosis</span>
          </Link>

          <nav className="flex-1 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {TABS.map((t) => {
              const active = pathname === t.to
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    active
                      ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {t.label}
                </Link>
              )
            })}
          </nav>

          <Link
            to="/login"
            className="shrink-0 px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            Ingresar
          </Link>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Pie compartido */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-10">
        <div className="max-w-5xl mx-auto px-6 py-10 grid sm:grid-cols-2 gap-6">
          <div>
            <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">🦋 Metamorfosis</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              IE República de Brasil · Manrique, comuna 3, Medellín · Cra. 42 A # 76-28
            </p>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              <a href="mailto:conexionmetamorfosis@gmail.com" className="text-green-600 dark:text-green-400 hover:underline">✉️ Correo</a>
              <a href="https://instagram.com/conexion_metamorfosis" target="_blank" rel="noreferrer" className="text-green-600 dark:text-green-400 hover:underline">📸 @conexion_metamorfosis</a>
              <Link to="/publico" className="text-green-600 dark:text-green-400 hover:underline">📊 Resultados</Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Créditos de imágenes</p>
            <ul className="text-xs text-gray-400 dark:text-gray-600 space-y-0.5">
              {CREDITS.map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}
