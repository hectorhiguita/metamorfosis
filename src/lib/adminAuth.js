import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

// Crea un usuario via REST API sin afectar la sesión del admin actual.
// El SDK de Firebase cierra sesión al crear usuarios; la REST API no lo hace.
export async function createStudentAccount({ displayName, email, password }) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyB8KkSdfS6FDBOKf4DcYRbPRpZ8gUUlfbg`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    }
  )

  const data = await res.json()

  if (data.error) {
    const msg = {
      EMAIL_EXISTS: 'Ya existe una cuenta con ese correo.',
      WEAK_PASSWORD: 'La contraseña debe tener al menos 6 caracteres.',
      INVALID_EMAIL: 'El correo no es válido.',
    }[data.error.message] ?? `Error: ${data.error.message}`
    throw new Error(msg)
  }

  // Crear el documento de perfil en Firestore
  await setDoc(doc(db, 'users', data.localId), {
    displayName,
    email,
    role: 'student',
    points: 0,
    createdAt: serverTimestamp(),
  })

  return data.localId
}
