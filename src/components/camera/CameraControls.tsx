import { Loader2, Play, Square, Camera } from 'lucide-react'
import { api } from '../../api/client'
import type { CameraStatus } from '../../api/types'

interface CameraControlsProps {
  status: CameraStatus | null
  loading: boolean
  onStart: () => void
  onStop: () => void
}

export function CameraControls({ status, loading, onStart, onStop }: CameraControlsProps) {
  const running = status?.running ?? false

  const handleSnapshot = () => {
    window.open(api.camera.snapshotUrl(), '_blank')
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={running ? onStop : onStart}
        disabled={loading}
        className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all active:scale-95 disabled:opacity-60 w-full"
        style={{
          background: running
            ? 'rgba(107,114,128,0.2)'
            : 'rgba(34,197,94,0.2)',
          color: running ? '#9ca3af' : '#22c55e',
          border: `1px solid ${running ? 'rgba(107,114,128,0.3)' : 'rgba(34,197,94,0.3)'}`,
        }}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : running ? (
          <Square size={16} />
        ) : (
          <Play size={16} />
        )}
        {loading ? 'Please wait…' : running ? 'Stop Camera' : 'Start Camera'}
      </button>

      <button
        onClick={handleSnapshot}
        disabled={!running}
        className="flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all active:scale-95 disabled:opacity-40 w-full"
        style={{
          background: 'rgba(0,212,255,0.1)',
          color: '#00d4ff',
          border: '1px solid rgba(0,212,255,0.2)',
        }}
      >
        <Camera size={16} />
        Snapshot
      </button>
    </div>
  )
}
