import { useState, useEffect } from 'react'
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, updateDoc, increment } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const PLANT_TYPES = [
  'Asclepias curassavica',
  'Asclepias tuberosa',
  'Passiflora edulis',
  'Passiflora incarnata',
  'Lantana camara',
  'Stachytarpheta jamaicensis',
  'Otra hospedera',
  'Otra nectarífera',
]

const POINTS_PER_ACTION = {
  base: 10,
  withPhoto: 15,
  withNotes: 5,
}

export default function RegisterPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [plants, setPlants] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    plantId: '',
    newPlantName: '',
    newPlantType: PLANT_TYPES[0],
    isNewPlant: false,
    height: '',
    leavesCount: '',
    healthStatus: 'saludable',
    notes: '',
    temperature: '',
    humidity: '',
    imageFile: null,
    imagePreview: null,
  })

  useEffect(() => {
    if (!user) return
    getDocs(query(collection(db, 'plants'), where('ownerId', '==', user.uid))).then((snap) => {
      setPlants(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    })
  }, [user])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setForm((f) => ({
      ...f,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
    }))
  }

  const uploadToGoogleDrive = async (file) => {
    // Placeholder: retorna null hasta que se configure OAuth de Google Drive
    // Se implementará con la API de Google Drive usando el token de usuario
    console.warn('Google Drive upload not yet configured')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    try {
      let plantId = form.plantId
      let plantName = ''

      // Crear planta nueva si aplica
      if (form.isNewPlant) {
        const plantDoc = await addDoc(collection(db, 'plants'), {
          name: form.newPlantName,
          type: form.newPlantType,
          ownerId: user.uid,
          ownerName: profile?.displayName ?? '',
          createdAt: serverTimestamp(),
        })
        plantId = plantDoc.id
        plantName = form.newPlantName
      } else {
        plantName = plants.find((p) => p.id === form.plantId)?.name ?? ''
      }

      // Subir imagen si existe
      let imageUrl = null
      if (form.imageFile) {
        imageUrl = await uploadToGoogleDrive(form.imageFile)
      }

      // Calcular puntos
      let pointsEarned = POINTS_PER_ACTION.base
      if (form.imageFile) pointsEarned += POINTS_PER_ACTION.withPhoto
      if (form.notes.trim()) pointsEarned += POINTS_PER_ACTION.withNotes

      // Guardar registro
      await addDoc(collection(db, 'logs'), {
        plantId,
        plantName,
        ownerId: user.uid,
        ownerName: profile?.displayName ?? '',
        height: form.height ? parseFloat(form.height) : null,
        leavesCount: form.leavesCount ? parseInt(form.leavesCount) : null,
        healthStatus: form.healthStatus,
        notes: form.notes,
        temperature: form.temperature ? parseFloat(form.temperature) : null,
        humidity: form.humidity ? parseFloat(form.humidity) : null,
        imageUrl,
        pointsEarned,
        createdAt: serverTimestamp(),
      })

      // Sumar puntos al usuario
      await updateDoc(doc(db, 'users', user.uid), {
        points: increment(pointsEarned),
      })

      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (err) {
      console.error(err)
      alert('Error al guardar el registro. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <span className="text-6xl animate-bounce">🎉</span>
        <p className="text-xl font-bold text-green-700 dark:text-green-400">¡Registro guardado!</p>
        <p className="text-gray-500">Redirigiendo...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Nuevo registro</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de planta */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">🌿 Planta</h2>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isNewPlant}
              onChange={(e) => setForm((f) => ({ ...f, isNewPlant: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Registrar planta nueva</span>
          </label>

          {form.isNewPlant ? (
            <div className="space-y-3">
              <input
                required
                placeholder="Nombre o código de la planta"
                value={form.newPlantName}
                onChange={(e) => setForm((f) => ({ ...f, newPlantName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <select
                value={form.newPlantType}
                onChange={(e) => setForm((f) => ({ ...f, newPlantType: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {PLANT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          ) : (
            <select
              required
              value={form.plantId}
              onChange={(e) => setForm((f) => ({ ...f, plantId: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Selecciona una planta...</option>
              {plants.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
              ))}
            </select>
          )}
        </div>

        {/* Mediciones */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">📏 Mediciones</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Altura (cm)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={form.height}
                onChange={(e) => setForm((f) => ({ ...f, height: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0.0"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">N° de hojas</label>
              <input
                type="number"
                min="0"
                value={form.leavesCount}
                onChange={(e) => setForm((f) => ({ ...f, leavesCount: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="0"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Estado de salud</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'saludable', label: '✅ Saludable' },
                { value: 'regular', label: '⚠️ Regular' },
                { value: 'enfermo', label: '🚨 Enfermo' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, healthStatus: value }))}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    form.healthStatus === value
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Ambiente (manual si no hay sensor) */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">🌡️ Ambiente <span className="text-xs font-normal text-gray-400">(opcional, si no hay sensor)</span></h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Temperatura (°C)</label>
              <input
                type="number"
                step="0.1"
                value={form.temperature}
                onChange={(e) => setForm((f) => ({ ...f, temperature: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="25.0"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Humedad (%)</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={form.humidity}
                onChange={(e) => setForm((f) => ({ ...f, humidity: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="60.0"
              />
            </div>
          </div>
        </div>

        {/* Foto y notas */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">📸 Foto y notas</h2>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-2 block">
              Foto de la planta <span className="text-green-600">+15 pts</span>
            </label>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {form.imagePreview && (
              <img
                src={form.imagePreview}
                alt="Preview"
                className="mt-3 rounded-lg max-h-48 object-cover w-full"
              />
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
              Observaciones <span className="text-green-600">+5 pts</span>
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="¿Qué observas en la planta hoy?"
              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>
        </div>

        {/* Resumen de puntos */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-sm">
          <p className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">⭐ Puntos que ganarás</p>
          <ul className="text-yellow-700 dark:text-yellow-400 space-y-0.5">
            <li>✓ Registro base: +{POINTS_PER_ACTION.base} pts</li>
            {form.imageFile && <li>✓ Foto incluida: +{POINTS_PER_ACTION.withPhoto} pts</li>}
            {form.notes.trim() && <li>✓ Observaciones: +{POINTS_PER_ACTION.withNotes} pts</li>}
          </ul>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-xl transition-colors"
        >
          {loading ? 'Guardando...' : 'Guardar registro'}
        </button>
      </form>
    </div>
  )
}
