import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

const API_KEY = 'AIzaSyB8KkSdfS6FDBOKf4DcYRbPRpZ8gUUlfbg'

// Borra la cuenta de Auth recién creada usando su idToken. Se usa para hacer
// rollback si la creación del perfil en Firestore falla, evitando dejar
// cuentas "huérfanas" (en Auth pero sin documento en `users`).
async function deleteAuthUser(idToken) {
  try {
    await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    )
  } catch (e) {
    console.error('No se pudo revertir la cuenta de Auth tras fallar el perfil:', e)
  }
}

// Crea un usuario via REST API sin afectar la sesión del admin actual.
// El SDK de Firebase cierra sesión al crear usuarios; la REST API no lo hace.
export async function createStudentAccount({ displayName, email, password }) {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
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

  // Crear el documento de perfil en Firestore. Si falla (p. ej. permisos),
  // revertimos la cuenta de Auth para no dejar un usuario huérfano.
  try {
    await setDoc(doc(db, 'users', data.localId), {
      displayName,
      email,
      role: 'student',
      points: 0,
      createdAt: serverTimestamp(),
    })
  } catch (err) {
    await deleteAuthUser(data.idToken)
    throw new Error(
      'La cuenta se creó pero no se pudo guardar el perfil, así que se revirtió. ' +
        'Verifica las reglas de Firestore e intenta de nuevo.',
      { cause: err }
    )
  }

  return data.localId
}
