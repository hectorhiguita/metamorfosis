// Componentes de presentación reutilizados por las páginas informativas públicas.

export function Section({ children, className = '' }) {
  return <section className={`max-w-5xl mx-auto px-6 ${className}`}>{children}</section>
}

export function Eyebrow({ children, color = 'text-green-600 dark:text-green-400' }) {
  return <span className={`text-xs font-semibold uppercase tracking-wide ${color}`}>{children}</span>
}
