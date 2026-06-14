import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// La API key de Firebase web es pública por diseño (va en el cliente).
// La seguridad se gestiona con las reglas de Firestore, no ocultando esta clave.
const firebaseConfig = {
  apiKey: "AIzaSyB8KkSdfS6FDBOKf4DcYRbPRpZ8gUUlfbg",
  authDomain: "project-2177efd0-1725-4764-896.firebaseapp.com",
  projectId: "project-2177efd0-1725-4764-896",
  storageBucket: "project-2177efd0-1725-4764-896.firebasestorage.app",
  messagingSenderId: "664381707683",
  appId: "1:664381707683:web:026720d798cbfba171b616",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
