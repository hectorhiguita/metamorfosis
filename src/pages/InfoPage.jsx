import { Link } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'
import { Section } from '../components/InfoSection'

const asset = (p) => `${import.meta.env.BASE_URL}info/${p}`

const TAB_CARDS = [
  {
    to: '/conoce',
    img: 'oficial/jardin-2.jpg',
    eyebrow: 'El proyecto',
    title: 'Conoce Metamorfosis',
    text: 'Qué es, nuestro propósito y la historia detrás de esta experiencia pedagógica, ambiental y tecnológica.',
  },
  {
    to: '/jardin',
    img: 'oficial/jardin-1.jpg',
    eyebrow: 'El jardín vivo',
    title: 'Explora el Jardín Vivo',
    text: 'Un jardín funcional: ecología, educación y producción en un mismo espacio lleno de vida.',
  },
  {
    to: '/mariposas',
    img: 'esp-monarca.jpg',
    eyebrow: 'Biodiversidad',
    title: 'Nuestras Mariposas',
    text: 'Tres especies, tres historias de vida, y el video de cómo nace una mariposa monarca.',
  },
]

export default function InfoPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <header className="relative">
        <div className="h-80 sm:h-[26rem] overflow-hidden">
          <img src={asset('hero-mariposa.jpg')} alt="Mariposa monarca sobre una flor" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <div className="text-5xl sm:text-6xl mb-2">🦋</div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white drop-shadow">Metamorfosis</h1>
          <p className="text-emerald-200 font-semibold tracking-wide mt-1">Conecta · Crea · Transforma</p>
          <p className="text-white/90 mt-3 max-w-2xl drop-shadow text-sm sm:text-base">
            Data Mariposas en el Valle de Aburrá — Institución Educativa República de Brasil, Medellín.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Link to="/conoce" className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg">
              Conoce el proyecto
            </Link>
            <Link to="/publico" className="px-6 py-2.5 bg-white/90 hover:bg-white text-gray-900 text-sm font-semibold rounded-lg transition-colors shadow-lg">
              Ver resultados
            </Link>
          </div>
        </div>
      </header>

      {/* Intro */}
      <Section className="py-14 text-center">
        <p className="text-lg text-gray-700 dark:text-gray-200 max-w-3xl mx-auto leading-relaxed">
          Una iniciativa que concibe el entorno escolar como un <strong>laboratorio vivo</strong>, donde se articulan el
          conocimiento científico, la ética del cuidado, la creatividad y el uso responsable de la tecnología, tomando la
          crianza de la <strong>mariposa monarca</strong> como emblema de transformación.
        </p>
      </Section>

      {/* Accesos a las pestañas */}
      <Section className="pb-16">
        <div className="grid md:grid-cols-3 gap-5">
          {TAB_CARDS.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-green-400 dark:hover:border-green-600 hover:shadow-md transition-all"
            >
              <div className="h-44 overflow-hidden">
                <img src={asset(c.img)} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">{c.eyebrow}</span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-1.5">{c.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{c.text}</p>
                <span className="inline-block mt-3 text-sm font-semibold text-green-600 dark:text-green-400">Ver más →</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Únete a la red */}
      <Section className="pb-16">
        <div className="bg-emerald-50/70 dark:bg-gray-900/40 rounded-3xl p-8 text-center">
          <span className="text-xs font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">Únete a la red</span>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-2 mb-3">Estaciones de aprendizaje móvil</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Soñamos con llevar la experiencia del jardín funcional más allá de un espacio fijo: módulos transportables con
            mini jardines, semillas, guías pedagógicas, sensores ambientales y recursos digitales para escuelas y comunidades.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <a href="mailto:conexionmetamorfosis@gmail.com" className="px-5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200 hover:border-green-400 transition-colors">✉️ conexionmetamorfosis@gmail.com</a>
            <a href="https://instagram.com/conexion_metamorfosis" target="_blank" rel="noreferrer" className="px-5 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200 hover:border-green-400 transition-colors">📸 @conexion_metamorfosis</a>
          </div>
        </div>
      </Section>
    </PublicLayout>
  )
}
