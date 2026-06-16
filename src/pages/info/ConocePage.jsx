import PublicLayout from '../../components/PublicLayout'
import { Section, Eyebrow } from '../../components/InfoSection'

const asset = (p) => `${import.meta.env.BASE_URL}info/${p}`

const MILESTONES = [
  { date: '2023', text: 'Nace la propuesta a partir de experiencias en un vivero con mariposario.' },
  { date: 'Julio 2024', text: 'Siembra inicial en la institución.' },
  { date: 'Marzo – Abril 2025', text: 'Consolidación de los jardines funcionales con integración STEM + IA.' },
  { date: 'Octubre 2025', text: 'Reconocimiento del Ministerio de Educación Nacional (MEN).' },
]

export default function ConocePage() {
  return (
    <PublicLayout>
      {/* Encabezado */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <Section className="py-14 text-center">
          <Eyebrow color="text-emerald-200">Conoce Metamorfosis</Eyebrow>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2">Una iniciativa pedagógica, ambiental y tecnológica</h1>
        </Section>
      </div>

      {/* Qué es */}
      <Section className="py-14">
        <div className="max-w-3xl mx-auto">
          <Eyebrow>¿Qué es Metamorfosis?</Eyebrow>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
            Metamorfosis es una experiencia pedagógica desarrollada en la <strong>IE República de Brasil (Medellín)</strong> que
            integra biodiversidad, tecnología emergente, inteligencia artificial, emprendimiento y educación ambiental urbana
            para transformar espacios deteriorados en <strong>ecosistemas inteligentes de aprendizaje</strong>.
          </p>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
            El proyecto comenzó estudiando la <strong>mariposa monarca</strong> como símbolo de transformación, evolucionando
            hacia jardines inteligentes con sensores, análisis de datos e impresión 3D.
          </p>
        </div>
      </Section>

      {/* Propósito */}
      <Section className="py-14 bg-emerald-50/60 dark:bg-gray-900/40 rounded-3xl">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow>Nuestro propósito</Eyebrow>
          <blockquote className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mt-3 leading-snug">
            “Transformar los espacios escolares en ecosistemas vivos e inteligentes mediante jardines funcionales y huertas
            educativas que integren biodiversidad, tecnología, emprendimiento y sostenibilidad.”
          </blockquote>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-5">
            La iniciativa se desarrolla progresivamente, comenzando con investigación, sensibilización ambiental y observación
            directa, antes de incorporar tecnologías avanzadas. La inteligencia artificial funciona como herramienta de apoyo,
            manteniendo un enfoque ético donde <em>«la tecnología es un medio al servicio de la vida y no un fin en sí misma.»</em>
          </p>
        </div>
      </Section>

      {/* Historia */}
      <Section className="py-14">
        <div className="text-center mb-10">
          <Eyebrow>Nuestra historia</Eyebrow>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">De una idea a un reconocimiento nacional</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-2xl mx-auto">
            Iniciada en 2023 a partir de experiencias en un vivero con mariposario, la propuesta evolucionó durante 2025 hacia
            jardines funcionales con integración STEM + IA.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <ol className="relative border-l-2 border-green-200 dark:border-green-900 ml-3 space-y-6">
            {MILESTONES.map((m) => (
              <li key={m.date} className="ml-6">
                <span className="absolute -left-2.5 w-5 h-5 rounded-full bg-green-500 ring-4 ring-emerald-50 dark:ring-gray-950" />
                <p className="text-sm font-bold text-green-700 dark:text-green-400">{m.date}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{m.text}</p>
              </li>
            ))}
          </ol>
          <img src={asset('oficial/jardin-3.jpg')} alt="Jardín del proyecto Metamorfosis" className="rounded-2xl shadow-md w-full h-72 object-cover" />
        </div>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-10">
          Con el apoyo de aliados como <strong>EPM</strong>, <strong>Universidad de Antioquia</strong> y la <strong>Secretaría de Medio Ambiente</strong>.
        </p>
      </Section>
    </PublicLayout>
  )
}
