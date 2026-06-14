import { Timestamp } from 'firebase/firestore'

// Fecha de hoy en formato yyyy-mm-dd respetando la zona horaria local.
export function todayStr() {
  const d = new Date()
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

// Convierte un yyyy-mm-dd en un Timestamp al mediodía local (evita saltos de
// día por zona horaria).
export function dateStrToTimestamp(str) {
  const [y, m, d] = str.split('-').map(Number)
  return Timestamp.fromDate(new Date(y, m - 1, d, 12, 0, 0))
}
