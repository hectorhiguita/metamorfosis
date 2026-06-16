import PublicLayout from '../../components/PublicLayout'
import { Section, Eyebrow } from '../../components/InfoSection'

const asset = (p) => `${import.meta.env.BASE_URL}info/${p}`

const PLANT_KINDS = [
  { icon: '🍃', label: 'Hospederas', desc: 'Alimentan a las orugas' },
  { icon: '🌸', label: 'Nectaríferas', desc: 'Néctar para mariposas adultas' },
  { icon: '🌿', label: 'Aromáticas', desc: 'Aroma y repelencia natural' },
  { icon: '💊', label: 'Medicinales', desc: 'Saberes tradicionales' },
  { icon: '🥬', label: 'Hortalizas', desc: 'Huerta educativa y alimento' },
]

const DIMENSIONS = [
  { icon: '🌎', title: 'Ambiental', text: 'Atrae biodiversidad, conserva polinizadores y mejora el suelo, el aire y el microclima.' },
  { icon: '🤝', title: 'Social', text: 'Fortalece el sentido de pertenencia y el trabajo comunitario alrededor del cuidado de la vida.' },
  { icon: '🎓', title: 'Formativa', text: 'Es un laboratorio vivo para observar ciclos de vida y desarrollar pensamiento científico.' },
]

export default function JardinPage() {
  return (
    <PublicLayout>
      {/* Encabezado */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <Section className="py-14 text-center">
          <Eyebrow color="text-emerald-200">Explora el Jardín Vivo</Eyebrow>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2">El jardín funcional</h1>
        </Section>
      </div>

      {/* Definición */}
      <Section className="py-14">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <img src={asset('oficial/jardin-1.jpg')} alt="Jardín funcional Metamorfosis" className="rounded-2xl shadow-md w-full h-72 object-cover" />
          <div>
            <Eyebrow>Jardín funcional</Eyebrow>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
              Un jardín funcional es un espacio verde <strong>diseñado intencionalmente</strong> para cumplir funciones
              ecológicas, educativas, sociales y productivas, más allá de lo ornamental.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
              Estos espacios crean ecosistemas que conservan la biodiversidad, atraen polinizadores, mejoran el suelo y el aire,
              regulan microclimas y promueven el uso responsable del agua. En educación funciona como un laboratorio vivo para
              observar ciclos de vida y desarrollar el pensamiento científico.
            </p>
          </div>
        </div>
      </Section>

      {/* Sistema de relaciones vivas */}
      <Section className="py-14 bg-emerald-50/60 dark:bg-gray-900/40 rounded-3xl">
        <div className="max-w-3xl mx-auto text-center">
          <Eyebrow>Un sistema de relaciones vivas</Eyebrow>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
            El jardín funcional es un <strong>ecosistema interconectado</strong> donde las plantas, el suelo, el agua, los
            polinizadores y las personas forman una red dinámica. Se diferencia del jardín decorativo por su función ecológica
            y su valor educativo: aquí cada elemento cumple un propósito y se relaciona con los demás.
          </p>
        </div>
      </Section>

      {/* Dimensiones */}
      <Section className="py-14">
        <div className="text-center mb-8">
          <Eyebrow>Dimensiones del jardín funcional</Eyebrow>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">Un impacto en tres niveles</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {DIMENSIONS.map((d) => (
            <div key={d.title} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">{d.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{d.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{d.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Vida con propósito + tipos de plantas */}
      <Section className="py-14 bg-emerald-50/60 dark:bg-gray-900/40 rounded-3xl">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <Eyebrow>Vida con propósito</Eyebrow>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-3">
            A diferencia de un jardín decorativo, el jardín funcional prioriza la biodiversidad, las plantas nativas y el
            aprendizaje activo. Puede combinar distintos tipos de plantas, cada uno con su propia función:
          </p>
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

      {/* Galería */}
      <Section className="py-14">
        <div className="text-center mb-8">
          <Eyebrow>Nuestro jardín</Eyebrow>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-2">Un espacio que cobra vida</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <img src={asset('oficial/jardin-1.jpg')} alt="Jardín Metamorfosis" className="rounded-2xl shadow-md w-full h-48 sm:h-64 object-cover" />
          <img src={asset('oficial/jardin-2.jpg')} alt="Jardín Metamorfosis" className="rounded-2xl shadow-md w-full h-48 sm:h-64 object-cover" />
          <img src={asset('oficial/jardin-3.jpg')} alt="Jardín Metamorfosis" className="rounded-2xl shadow-md w-full h-48 sm:h-64 object-cover col-span-2 sm:col-span-1" />
        </div>
      </Section>
    </PublicLayout>
  )
}
