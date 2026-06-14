import { Link } from 'react-router-dom'

const img = (name) => `${import.meta.env.BASE_URL}info/${name}`

const LIFECYCLE = [
  {
    img: 'ciclo-huevo.jpg',
    icon: '🥚',
    title: 'Huevo',
    duration: '3 – 5 días',
    text: 'La mariposa pone sus huevos sobre las hojas de una planta hospedera. Son diminutos, del tamaño de la cabeza de un alfiler.',
  },
  {
    img: 'ciclo-oruga.jpg',
    icon: '🐛',
    title: 'Oruga (larva)',
    duration: '10 – 14 días',
    text: 'Al nacer, la oruga se alimenta sin parar de las hojas de la planta hospedera y crece rápidamente, mudando su piel varias veces.',
  },
  {
    img: 'ciclo-crisalida.jpg',
    icon: '🛡️',
    title: 'Crisálida (pupa)',
    duration: '10 – 14 días',
    text: 'La oruga forma una crisálida y, en su interior, ocurre la transformación más asombrosa: la metamorfosis hacia mariposa.',
  },
  {
    img: 'ciclo-mariposa.jpg',
    icon: '🦋',
    title: 'Mariposa (adulto)',
    duration: '2 – 6 semanas',
    text: 'Emerge la mariposa adulta. Se alimenta del néctar de las flores nectaríferas y, al reproducirse, reinicia el ciclo.',
  },
]

const CREDITS = [
  'Mariposa monarca — Derek Ramsey (GFDL), Wikimedia Commons',
  'Huevo — CC0, Wikimedia Commons',
  'Oruga — GFDL, Wikimedia Commons',
  'Crisálida — CC BY-SA 3.0, Wikimedia Commons',
  'Asclepias curassavica — CC BY-SA 3.0, Wikimedia Commons',
  'Lantana camara — CC BY 2.5, Wikimedia Commons',
  'Buddleja davidii — CC BY-SA 4.0, Wikimedia Commons',
]

function Section({ children, className = '' }) {
  return <section className={`max-w-5xl mx-auto px-6 ${className}`}>{children}</section>
}

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero */}
      <header className="relative">
        <div className="h-72 sm:h-96 overflow-hidden">
          <img src={img('hero-mariposa.jpg')} alt="Mariposa monarca sobre una flor" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="text-5xl sm:text-6xl mb-2">🦋</div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white drop-shadow">Metamorfosis</h1>
          <p className="text-white/90 mt-3 max-w-2xl drop-shadow">
            Un proyecto escolar para conocer, cultivar y proteger las plantas que dan vida a las mariposas.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Link to="/login" className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg">
              Ingresar al portal
            </Link>
            <Link to="/publico" className="px-6 py-2.5 bg-white/90 hover:bg-white text-gray-900 text-sm font-semibold rounded-lg transition-colors shadow-lg">
              Ver resultados
            </Link>
          </div>
        </div>
      </header>

      {/* Plantas hospederas */}
      <Section className="py-14">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img src={img('hospedera-asclepias.jpg')} alt="Asclepias curassavica, planta hospedera" className="rounded-2xl shadow-md w-full h-64 object-cover" />
          <div>
            <span className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">Plantas hospederas</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 mb-3">El hogar de las orugas</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Las <strong>plantas hospederas</strong> son aquellas donde las mariposas ponen sus huevos y de las que se
              alimentan las orugas. Cada especie de mariposa depende de plantas específicas: por ejemplo, la mariposa
              monarca necesita las <em>Asclepias</em> (algodoncillo o flor de seda) para sobrevivir.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
              Sin plantas hospederas, no hay nuevas mariposas. Por eso cultivarlas es clave para conservarlas.
            </p>
          </div>
        </div>
      </Section>

      {/* Plantas nectaríferas */}
      <Section className="py-14 bg-emerald-50/60 dark:bg-gray-900/40 rounded-3xl">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="md:order-2 grid grid-cols-2 gap-3">
            <img src={img('nectarifera-lantana.jpg')} alt="Lantana camara" className="rounded-2xl shadow-md w-full h-48 object-cover" />
            <img src={img('nectarifera-buddleja.jpg')} alt="Buddleja davidii" className="rounded-2xl shadow-md w-full h-48 object-cover" />
          </div>
          <div className="md:order-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-pink-600 dark:text-pink-400">Plantas nectaríferas</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 mb-3">El alimento de las mariposas</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Las <strong>plantas nectaríferas</strong> producen néctar, el alimento principal de las mariposas adultas.
              Flores como la <em>Lantana</em>, la <em>Buddleja</em> (arbusto de las mariposas), la verbena o el cosmos
              atraen a las mariposas y les dan la energía que necesitan para volar y reproducirse.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
              Un jardín completo combina plantas <strong>hospederas</strong> (para las orugas) y <strong>nectaríferas</strong> (para las mariposas).
            </p>
          </div>
        </div>
      </Section>

      {/* Ciclo de vida */}
      <Section className="py-14">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">Metamorfosis</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">El ciclo de vida de la mariposa</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            De huevo a mariposa en aproximadamente <strong>4 a 6 semanas</strong>.
          </p>
        </div>

        {/* Línea de tiempo */}
        <ol className="relative border-l-2 border-green-200 dark:border-green-900 ml-3 sm:ml-6 space-y-10">
          {LIFECYCLE.map((s, i) => (
            <li key={s.title} className="ml-6 sm:ml-10">
              <span className="absolute -left-4 sm:-left-5 flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white text-sm font-bold ring-4 ring-emerald-50 dark:ring-gray-950">
                {i + 1}
              </span>
              <div className="grid sm:grid-cols-3 gap-4 items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
                <img src={img(s.img)} alt={s.title} className="rounded-xl w-full h-40 object-cover sm:col-span-1" />
                <div className="sm:col-span-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{s.icon}</span>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{s.title}</h3>
                    <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                      ⏱ {s.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{s.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="text-center mt-10">
          <Link to="/login" className="inline-block px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors">
            Ingresar al portal
          </Link>
        </div>
      </Section>

      {/* Créditos */}
      <footer className="max-w-5xl mx-auto px-6 py-10 mt-6 border-t border-gray-200 dark:border-gray-800">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Créditos de imágenes</p>
        <ul className="text-xs text-gray-400 dark:text-gray-600 space-y-0.5">
          {CREDITS.map((c) => <li key={c}>{c}</li>)}
        </ul>
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">Proyecto Metamorfosis · Educación ambiental</p>
      </footer>
    </div>
  )
}
