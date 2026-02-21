import { useState, useEffect } from 'react'
import { Camera } from 'lucide-react'

interface CameraStreamProps {
  running: boolean
  streamUrl: string
  mock?: boolean
}

export function CameraStream({ running, streamUrl, mock }: CameraStreamProps) {
  const [error, setError] = useState(false)
  const [cacheBust, setCacheBust] = useState('')

  // Reset error when running changes — only schedule it, don't set state during render
  useEffect(() => {
    const id = setTimeout(() => setError(false), 0)
    return () => clearTimeout(id)
  }, [running])

  useEffect(() => {
    if (!error || !running) return
    const interval = setInterval(() => {
      setCacheBust(`?t=${Date.now()}`)
    }, 3000)
    return () => clearInterval(interval)
  }, [error, running])

  if (!running) {
    return (
      <div
        className="w-full rounded-xl flex flex-col items-center justify-center gap-3 text-gray-500"
        style={{ aspectRatio: '16/9', background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Camera size={48} strokeWidth={1} />
        <p className="text-sm">Camera not started</p>
        {mock && <p className="text-xs text-amber-500">(mock mode — placeholder frames)</p>}
      </div>
    )
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9', background: '#000' }}>
      <img
        src={`${streamUrl}${cacheBust}`}
        alt="Camera stream"
        className="w-full h-full object-contain"
        onError={() => setError(true)}
      />
      {error && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-gray-400"
          style={{ background: 'rgba(0,0,0,0.7)' }}
        >
          <Camera size={32} strokeWidth={1} />
          <p>Stream error — reconnecting…</p>
        </div>
      )}
      {mock && (
        <span
          className="absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-bold"
          style={{ background: 'rgba(245,158,11,0.8)', color: '#000' }}
        >
          MOCK
        </span>
      )}
    </div>
  )
}
