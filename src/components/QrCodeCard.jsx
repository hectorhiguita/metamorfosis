import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

// Tarjeta con el código QR de seguimiento de una planta. El QR codifica la URL
// absoluta a la página de detalle (identificador único = id del documento).
export default function QrCodeCard({ path, code, title = 'Código QR de seguimiento' }) {
  const wrapRef = useRef(null)
  const url = `${window.location.origin}/metamorfosis${path}`

  const handleDownload = () => {
    const canvas = wrapRef.current?.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `qr-${code}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-5 mb-6">
      <div ref={wrapRef} className="bg-white p-3 rounded-lg border border-gray-200 shrink-0">
        <QRCodeCanvas value={url} size={128} level="M" />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-1">📱 {title}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Imprime y pega este código en la planta para abrir su seguimiento al escanearlo.
        </p>
        <p className="text-xs text-gray-400 mb-0.5">Identificador único</p>
        <p className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all mb-3">{code}</p>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          Descargar QR
        </button>
      </div>
    </div>
  )
}
