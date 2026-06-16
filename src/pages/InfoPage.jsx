import { Link } from 'react-router-dom'

const asset = (p) => `${import.meta.env.BASE_URL}info/${p}`

const MILESTONES = [
  { date: '2023', text: 'Nace la idea tras una vivencia pedagógica en un mariposario.' },
  { date: 'Julio 2024', text: 'Siembra inicial en la institución.' },
  { date: 'Mar – Abr 2025', text: 'Consolidación de los jardines funcionales.' },
  { date: 'Octubre 2025', text: 'Reconocimiento del Ministerio de Educación Nacional (MEN).' },
]

const PLANT_KINDS = [
  { icon: '🍃', label: 'Hospederas', desc: 'Alimentan a las orugas' },
  { icon: '🌸', label: 'Nectaríferas', desc: 'Néctar para mariposas adultas' },
  { icon: '🌿', label: 'Aromáticas', desc: 'Aroma y repelencia natural' },
  { icon: '💊', label: 'Medicinales', desc: 'Saberes tradicionales' },
  { icon: '🥬', label: 'Hortalizas', desc: 'Huerta educativa y alimento' },
]

const BUTTERFLIES = [
  {
    name: 'Mariposa Monarca',
    sci: 'Danaus plexippus',
    img: 'esp-monarca.jpg',
    desc: 'Alas naranjas con venas negras y puntos blancos.',
    host: 'Algodoncillo / Asclepia',
    nectar: 'Lantana, verbena, zinnia, girasol',
    cycle: 'Huevo (3–5 d) · Oruga (10–14 d) · Crisálida verde con puntos dorados (8–12 d) · Adulto',
  },
  {
    name: 'Mariposa de la col',
    sci: 'Ascia monuste',
    img: 'esp-col.jpg',
    desc: 'Color blanco o crema con marcas oscuras.',
    host: 'Repollo, col, mostaza, rábano, brócoli',
    nectar: 'Verbena, lantana, margaritas, tréboles',
    cycle: 'Huevo (3–4 d) · Oruga (1–2 sem) · Crisálida (7–10 d)',
  },
  {
    name: 'Mariposa Malaquita',
    sci: 'Siproeta epaphus',
    img: 'esp-malaquita.jpg',
    desc: 'Alas oscuras con franjas verde brillante / turquesa.',
    host: 'Familias Acanthaceae y Verbenaceae',
    nectar: 'Lantanas, ixoras, porterweed',
    cycle: 'Huevo (3–5 d) · Larva espinosa (10–14 d) · Crisálida (7–10 d)',
  },
]

const LIFECYCLE = [
  { img: 'ciclo-huevo.jpg', icon: '🥚', title: 'Huevo', duration: '3 – 5 días', text: 'La mariposa pone sus huevos sobre las hojas de una planta hospedera. Son diminutos, del tamaño de la cabeza de un alfiler.' },
  { img: 'ciclo-oruga.jpg', icon: '🐛', title: 'Oruga (larva)', duration: '10 – 14 días', text: 'La oruga se alimenta sin parar de la planta hospedera y crece rápidamente, mudando su piel varias veces.' },
  { img: 'ciclo-crisalida.jpg', icon: '🛡️', title: 'Crisálida (pupa)', duration: '8 – 12 días', text: 'Forma una crisálida verde con puntos dorados y, en su interior, ocurre la metamorfosis hacia mariposa.' },
  { img: 'ciclo-mariposa.jpg', icon: '🦋', title: 'Mariposa (adulto)', duration: '2 – 6 semanas', text: 'Emerge la mariposa adulta. Se alimenta del néctar de las flores nectaríferas y reinicia el ciclo.' },
]

const CREDITS = [
  'Fotografías del jardín: proyecto Metamorfosis · IE República de Brasil',
  'Ciclo de vida y especies (referencia): Wikimedia Commons (CC0 / CC BY / CC BY-SA / GFDL)',
]

function Section({ children, className = '' }) {
  return <section className={`max-w-5xl mx-auto px-6 ${className}`}>{children}</section>
}

function Eyebrow({ children, color = 'text-green-600 dark:text-green-400' }) {
  return <span className={`text-xs font-semibold uppercase tracking-wide ${color}`}>{children}</span>
}

export default function InfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero */}
      <header className="relative">
        <div className="h-80 sm:h-[28rem] overflow-hidden">
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
            <Link to="/login" className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg">
              Ingresar al portal
            </Link>
            <Link to="/publico" className="px-6 py-2.5 bg-white/90 hover:bg-white text-gray-900 text-sm font-semibold rounded-lg transition-colors shadow-lg">
              Ver resultados
            </Link>
          </div>
        </div>
      </header>

      {/* Qué es */}
      <Section className="py-14">
        <div className="text-center max-w-3xl mx-auto">
          <Eyebrow>¿Qué es Metamorfosis?</Eyebrow>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
            Una iniciativa pedagógica, ambiental y tecnológica
          </h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Concebimos el entorno escolar como un <strong>laboratorio vivo</strong> donde se articulan el conocimiento
            científico, la ética del cuidado, la creatividad y el uso responsable de la tecnología. El proyecto integra
            biodiversidad, inteligencia artificial, emprendimiento y educación ambiental urbana, tomando la crianza de la
            <strong> mariposa monarca</strong> como emblema de transformación.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🌱</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Propósito</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Transformar los espacios escolares en ecosistemas vivos e inteligentes mediante jardines funcionales y huertas educativas.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🤝</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Ética del cuidado</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              La tecnología es un medio al servicio de la vida: investigación y sensibilización ambiental con sentido.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🔬</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Tecnología</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Jardines inteligentes con sensores, análisis de datos e impresión 3D al servicio del aprendizaje.
            </p>
          </div>
        </div>
      </Section>

      {/* Historia / hitos */}
      <Section className="py-14 bg-emerald-50/60 dark:bg-gray-900/40 rounded-3xl">
        <div className="text-center mb-10">
          <Eyebrow>Nuestra historia</Eyebrow>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">De una idea a un reconocimiento nacional</h2>
        </div>
        <ol className="relative border-l-2 border-green-200 dark:border-green-900 ml-3 space-y-6 max-w-2xl mx-auto">
          {MILESTONES.map((m) => (
            <li key={m.date} className="ml-6">
              <span className="absolute -left-2.5 w-5 h-5 rounded-full bg-green-500 ring-4 ring-emerald-50 dark:ring-gray-950" />
              <p className="text-sm font-bold text-green-700 dark:text-green-400">{m.date}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">{m.text}</p>
            </li>
          ))}
        </ol>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
          Con el apoyo de aliados como <strong>EPM</strong>, <strong>Universidad de Antioquia</strong> y la <strong>Secretaría de Medio Ambiente</strong>.
        </p>
      </Section>

      {/* Jardín funcional */}
      <Section className="py-14">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <Eyebrow>Explora el jardín vivo</Eyebrow>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">El jardín funcional</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Un espacio verde intencional que va más allá de lo ornamental: cumple funciones <strong>ecológicas, educativas,
            sociales y productivas</strong>. Conserva la biodiversidad, atrae polinizadores, mejora el suelo y el aire, regula
            el microclima y promueve el uso responsable del agua. Para los estudiantes es un laboratorio vivo donde observan
            ciclos de vida y registran sus propias observaciones.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <img src={asset('oficial/jardin-1.jpg')} alt="Jardín funcional Metamorfosis" className="rounded-2xl shadow-md w-full h-40 sm:h-56 object-cover" />
          <img src={asset('oficial/jardin-2.jpg')} alt="Jardín funcional Metamorfosis" className="rounded-2xl shadow-md w-full h-40 sm:h-56 object-cover" />
          <img src={asset('oficial/jardin-3.jpg')} alt="Jardín funcional Metamorfosis" className="rounded-2xl shadow-md w-full h-40 sm:h-56 object-cover" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {PLANT_KINDS.map((k) => (
            <div key={k.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{k.icon}</div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{k.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{k.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Hospederas vs nectaríferas */}
      <Section className="py-14 bg-emerald-50/60 dark:bg-gray-900/40 rounded-3xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <img src={asset('hospedera-asclepias.jpg')} alt="Asclepias, planta hospedera" className="w-full h-48 object-cover" />
            <div className="p-5">
              <Eyebrow>Plantas hospederas</Eyebrow>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1 mb-2">El hogar de las orugas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Son las plantas donde las mariposas ponen sus huevos y de las que se alimentan las orugas. Cada especie
                depende de plantas específicas: la monarca necesita las <em>Asclepias</em> para sobrevivir.
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <img src={asset('nectarifera-lantana.jpg')} alt="Lantana, planta nectarífera" className="w-full h-48 object-cover" />
            <div className="p-5">
              <Eyebrow color="text-pink-600 dark:text-pink-400">Plantas nectaríferas</Eyebrow>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1 mb-2">El alimento de las mariposas</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Producen néctar, el alimento de las mariposas adultas. Flores como la <em>lantana</em>, la <em>verbena</em>,
                la <em>zinnia</em> o el girasol les dan la energía para volar y reproducirse.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Nuestras mariposas */}
      <Section className="py-14">
        <div className="text-center mb-10">
          <Eyebrow>Nuestras mariposas</Eyebrow>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">Tres historias de vida</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Biodiversidad que inspira y enseña.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {BUTTERFLIES.map((b) => (
            <div key={b.name} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
              <img src={asset(b.img)} alt={b.name} className="w-full h-44 object-cover" />
              <div className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-white">{b.name}</h3>
                <p className="text-xs italic text-gray-500 dark:text-gray-400 mb-2">{b.sci}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{b.desc}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300"><strong>🍃 Hospederas:</strong> {b.host}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1"><strong>🌸 Nectaríferas:</strong> {b.nectar}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 border-t border-gray-100 dark:border-gray-800 pt-2">
                  <strong>Ciclo:</strong> {b.cycle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Ciclo de vida */}
      <Section className="py-14 bg-emerald-50/60 dark:bg-gray-900/40 rounded-3xl">
        <div className="text-center mb-10">
          <Eyebrow>Metamorfosis</Eyebrow>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">El ciclo de vida de la mariposa</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            De huevo a mariposa en aproximadamente <strong>4 a 6 semanas</strong>.
          </p>
        </div>
        <ol className="relative border-l-2 border-green-200 dark:border-green-900 ml-3 sm:ml-6 space-y-8">
          {LIFECYCLE.map((s, i) => (
            <li key={s.title} className="ml-6 sm:ml-10">
              <span className="absolute -left-4 sm:-left-5 flex items-center justify-center w-8 h-8 rounded-full bg-green-500 text-white text-sm font-bold ring-4 ring-emerald-50 dark:ring-gray-950">
                {i + 1}
              </span>
              <div className="grid sm:grid-cols-3 gap-4 items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 shadow-sm">
                <img src={asset(s.img)} alt={s.title} className="rounded-xl w-full h-40 object-cover sm:col-span-1" />
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
      </Section>

      {/* Únete a la red */}
      <Section className="py-14">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <Eyebrow>Únete a la red</Eyebrow>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">Estaciones de aprendizaje móvil</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            Soñamos con llevar la experiencia del jardín funcional más allá de un espacio fijo: módulos transportables con
            mini jardines, semillas, guías pedagógicas, sensores ambientales y recursos digitales para escuelas y comunidades.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          <a href="mailto:conexionmetamorfosis@gmail.com" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 text-center hover:border-green-400 transition-colors">
            <div className="text-2xl mb-1">✉️</div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Correo</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 break-all">conexionmetamorfosis@gmail.com</p>
          </a>
          <a href="https://instagram.com/conexion_metamorfosis" target="_blank" rel="noreferrer" className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 text-center hover:border-green-400 transition-colors">
            <div className="text-2xl mb-1">📸</div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Instagram</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">@conexion_metamorfosis</p>
          </a>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 text-center">
            <div className="text-2xl mb-1">📍</div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Ubicación</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Manrique, comuna 3, Medellín · Cra. 42 A # 76-28</p>
          </div>
        </div>

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
        <p className="text-xs text-gray-400 dark:text-gray-600 mt-4">
          Proyecto Metamorfosis · IE República de Brasil, Medellín · Educación ambiental
        </p>
      </footer>
    </div>
  )
}
