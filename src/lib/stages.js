// Estados del ciclo de vida de la mariposa, en orden de progresión.
export const STAGES = [
  { value: 'huevo', label: 'Huevo', icon: '🥚', style: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' },
  { value: 'oruga', label: 'Oruga', icon: '🐛', style: 'bg-lime-50 text-lime-700 dark:bg-lime-900/20 dark:text-lime-400' },
  { value: 'crisalida', label: 'Crisálida', icon: '🛡️', style: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
  { value: 'mariposa', label: 'Mariposa', icon: '🦋', style: 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-400' },
]

export const stageMeta = (value) =>
  STAGES.find((s) => s.value === value) ?? {
    value,
    label: value ?? '—',
    icon: '•',
    style: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  }
