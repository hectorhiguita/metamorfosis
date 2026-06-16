import PublicLayout from '../../components/PublicLayout'
import { Section, Eyebrow } from '../../components/InfoSection'

const asset = (p) => `${import.meta.env.BASE_URL}info/${p}`

const BUTTERFLIES = [
  {
    name: 'La Mariposa Monarca',
    sci: 'Danaus plexippus',
    img: 'esp-monarca.jpg',
    desc: 'Presenta alas naranjas con venas negras y puntos blancos.',
    host: 'Algodoncillo o asclepia (donde deposita sus huevos)',
    cycle: 'Huevo (3–5 días) · Oruga con franjas (10–14 días) · Crisálida verde con puntos dorados (8–12 días) · Adulto (semanas a meses)',
  },
  {
    name: 'La Mariposa de la col',
    sci: 'Ascia monuste',
    img: 'esp-col.jpg',
    desc: 'Color blanco o crema con marcas oscuras.',
    host: 'Repollo, col, mostaza, rábano, brócoli',
    cycle: 'Huevo (3–4 días) · Oruga (1–2 semanas) · Crisálida (7–10 días) · Adulto polinizador',
  },
  {
    name: 'La Mariposa Malaquita',
    sci: 'Siproeta epaphus',
    img: 'esp-malaquita.jpg',
    desc: 'Alas oscuras con franjas verde brillante / turquesa.',
    host: 'Familias Acanthaceae y Verbenaceae',
    cycle: 'Huevo (3–5 días) · Larva espinosa (10–14 días) · Crisálida angular (7–10 días) · Adulto territorial',
  },
]

const LIFECYCLE = [
  { img: 'ciclo-huevo.jpg', icon: '🥚', title: 'Huevo', duration: '3 – 5 días' },
  { img: 'ciclo-oruga.jpg', icon: '🐛', title: 'Oruga', duration: '10 – 14 días' },
  { img: 'ciclo-crisalida.jpg', icon: '🛡️', title: 'Crisálida', duration: '8 – 12 días' },
  { img: 'ciclo-mariposa.jpg', icon: '🦋', title: 'Mariposa', duration: '2 – 6 semanas' },
]

export default function MariposasPage() {
  return (
    <PublicLayout>
      {/* Encabezado */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <Section className="py-14 text-center">
          <Eyebrow color="text-emerald-200">Nuestras Mariposas</Eyebrow>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2">Un jardín vivo donde nacen alas y aprendizajes</h1>
          <p className="text-emerald-100 mt-3 max-w-2xl mx-auto">
            Tres mariposas, tres historias de vida: biodiversidad que inspira y enseña.
          </p>
        </Section>
      </div>

      {/* Intro */}
      <Section className="py-12 text-center">
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          En la institución criamos tres especies de mariposas que representan el aprendizaje y la transformación: la Monarca,
          la de la col y la Malaquita. Su observación fortalece la investigación escolar, el respeto por la vida y la comprensión
          de los ecosistemas urbanos.
        </p>
      </Section>

      {/* Especies */}
      <Section className="pb-4">
        <div className="grid md:grid-cols-3 gap-5">
          {BUTTERFLIES.map((b) => (
            <div key={b.name} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
              <img src={asset(b.img)} alt={b.name} className="w-full h-44 object-cover" />
              <div className="p-5">
                <h3 className="font-bold text-gray-900 dark:text-white">{b.name}</h3>
                <p className="text-xs italic text-gray-500 dark:text-gray-400 mb-2">{b.sci}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{b.desc}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300"><strong>🍃 Hospederas:</strong> {b.host}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 border-t border-gray-100 dark:border-gray-800 pt-2">
                  <strong>Ciclo:</strong> {b.cycle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Ciclo de vida resumido */}
      <Section className="py-14">
        <div className="text-center mb-8">
          <Eyebrow>El ciclo de vida</Eyebrow>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">De huevo a mariposa en 4 – 6 semanas</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {LIFECYCLE.map((s, i) => (
            <div key={s.title} className="text-center">
              <div className="relative">
                <img src={asset(s.img)} alt={s.title} className="rounded-2xl shadow-md w-full h-36 object-cover" />
                <span className="absolute -top-2 -left-2 w-7 h-7 flex items-center justify-center rounded-full bg-green-500 text-white text-xs font-bold ring-2 ring-white dark:ring-gray-900">{i + 1}</span>
              </div>
              <p className="font-semibold text-gray-900 dark:text-white mt-2">{s.icon} {s.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">⏱ {s.duration}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Video */}
      <Section className="pb-16">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <Eyebrow>Video</Eyebrow>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">Así nace una Mariposa Monarca</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
              El nacimiento de una mariposa monarca como símbolo de transformación.
            </p>
          </div>
          <div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-lg" style={{ aspectRatio: '16 / 9' }}>
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube-nocookie.com/embed/SBNNr3e8-Fg"
              title="Así nace una Mariposa Monarca"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>
      </Section>
    </PublicLayout>
  )
}
