import { useEffect, useState, useCallback } from 'react'
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { createStudentAccount } from '../../lib/adminAuth'

// ─── Modal agregar/editar estudiante ─────────────────────────────────────────

function StudentModal({ student, onClose, onSaved }) {
  const isEdit = Boolean(student)
  const [form, setForm] = useState({
    displayName: student?.displayName ?? '',
    email: student?.email ?? '',
    group: student?.group ?? '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) {
        await updateDoc(doc(db, 'users', student.id), {
          displayName: form.displayName,
          group: form.group,
        })
      } else {
        if (form.password.length < 6) throw new Error('La contraseña debe tener al menos 6 caracteres.')
        await createStudentAccount({
          displayName: form.displayName,
          email: form.email,
          group: form.group,
          password: form.password,
        })
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {isEdit ? 'Editar estudiante' : 'Nuevo estudiante'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre completo
            </label>
            <input
              required
              value={form.displayName}
              onChange={set('displayName')}
              placeholder="Ej. María González"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Correo electrónico
            </label>
            <input
              required
              type="email"
              value={form.email}
              onChange={set('email')}
              disabled={isEdit}
              placeholder="estudiante@correo.com"
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {isEdit && (
              <p className="text-xs text-gray-400 mt-1">El correo no se puede modificar.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Grupo / Salón
            </label>
            <input
              value={form.group}
              onChange={set('group')}
              placeholder="Ej. 8A, 9B, Grupo 3..."
              className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Contraseña inicial
              </label>
              <input
                required
                type="password"
                value={form.password}
                onChange={set('password')}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                El estudiante podrá cambiarla después.
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-semibold transition-colors"
            >
              {loading ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear cuenta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Modal confirmación de eliminación ───────────────────────────────────────

function DeleteModal({ student, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    await onConfirm()
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          ¿Eliminar estudiante?
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          Se eliminará el perfil de <strong>{student.displayName}</strong> y sus{' '}
          {student._plantsCount ?? 0} planta(s). Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-semibold transition-colors"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Fila de estudiante ───────────────────────────────────────────────────────

function StudentRow({ student, onEdit, onDelete }) {
  const levelLabel =
    student.points < 100 ? '🌱 Semilla'
    : student.points < 300 ? '🌿 Brote'
    : student.points < 600 ? '🌾 Plántula'
    : '🦋 Mariposa'

  return (
    <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-4 py-3">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">{student.displayName}</p>
          <p className="text-xs text-gray-400">{student.email}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
        {student.group || '—'}
      </td>
      <td className="px-4 py-3 text-center">
        <span className="text-sm font-semibold text-yellow-600 dark:text-yellow-400">
          ⭐ {student.points ?? 0}
        </span>
        <p className="text-xs text-gray-400">{levelLabel}</p>
      </td>
      <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">
        {student._plantsCount ?? 0}
      </td>
      <td className="px-4 py-3 text-center text-sm text-gray-600 dark:text-gray-300">
        {student._logsCount ?? 0}
      </td>
      <td className="px-4 py-3 text-center text-xs text-gray-400">
        {student.createdAt?.toDate?.().toLocaleDateString('es-CO') ?? '—'}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onEdit(student)}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(student)}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export default function StudentsPage() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [groupFilter, setGroupFilter] = useState('')
  const [modal, setModal] = useState(null) // null | 'add' | { student } para editar
  const [deleteTarget, setDeleteTarget] = useState(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    const [usersSnap, plantsSnap, logsSnap] = await Promise.all([
      // Filtramos por role y ordenamos en el cliente para no requerir un
      // índice compuesto (role + displayName) en Firestore.
      getDocs(query(collection(db, 'users'), where('role', '==', 'student'))),
      getDocs(collection(db, 'plants')),
      getDocs(collection(db, 'logs')),
    ])

    // Conteos por estudiante
    const plantsByOwner = {}
    plantsSnap.forEach((d) => {
      const oid = d.data().ownerId
      plantsByOwner[oid] = (plantsByOwner[oid] ?? 0) + 1
    })
    const logsByOwner = {}
    logsSnap.forEach((d) => {
      const oid = d.data().ownerId
      logsByOwner[oid] = (logsByOwner[oid] ?? 0) + 1
    })

    setStudents(
      usersSnap.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
          _plantsCount: plantsByOwner[d.id] ?? 0,
          _logsCount: logsByOwner[d.id] ?? 0,
        }))
        .sort((a, b) => (a.displayName ?? '').localeCompare(b.displayName ?? ''))
    )
    setLoading(false)
  }, [])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  const handleDelete = async () => {
    if (!deleteTarget) return
    // Elimina el documento de perfil (la cuenta de Auth requiere Admin SDK,
    // se marca como eliminada solo en Firestore)
    await deleteDoc(doc(db, 'users', deleteTarget.id))
    setDeleteTarget(null)
    fetchStudents()
  }

  const groups = [...new Set(students.map((s) => s.group).filter(Boolean))].sort(
    (a, b) => a.localeCompare(b)
  )

  const filtered = students.filter((s) => {
    const q = search.toLowerCase()
    const matchesSearch =
      s.displayName?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.group?.toLowerCase().includes(q)
    const matchesGroup = !groupFilter || s.group === groupFilter
    return matchesSearch && matchesGroup
  })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Estudiantes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {students.length} estudiante{students.length !== 1 ? 's' : ''} registrado{students.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setModal('add')}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          + Nuevo estudiante
        </button>
      </div>

      {/* Buscador y filtro por grupo */}
      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          placeholder="Buscar por nombre, correo o grupo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-60 sm:max-w-80 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">Todos los grupos</option>
          {groups.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <span className="text-4xl">👥</span>
          <p className="text-gray-500 dark:text-gray-400 mt-3">
            {search ? 'Sin resultados para esa búsqueda' : 'Aún no hay estudiantes registrados'}
          </p>
          {!search && (
            <button
              onClick={() => setModal('add')}
              className="mt-3 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg"
            >
              Agregar el primero
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  <th className="px-4 py-3 text-left">Estudiante</th>
                  <th className="px-4 py-3 text-left">Grupo</th>
                  <th className="px-4 py-3 text-center">Puntos</th>
                  <th className="px-4 py-3 text-center">Plantas</th>
                  <th className="px-4 py-3 text-center">Registros</th>
                  <th className="px-4 py-3 text-center">Creado</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <StudentRow
                    key={s.id}
                    student={s}
                    onEdit={(s) => setModal(s)}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modales */}
      {modal && (
        <StudentModal
          student={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchStudents() }}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          student={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  )
}
