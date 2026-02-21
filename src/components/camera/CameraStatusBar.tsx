import type { CameraStatus } from '../../api/types'

interface CameraStatusBarProps {
  status: CameraStatus | null
}

export function CameraStatusBar({ status }: CameraStatusBarProps) {
  const running = status?.running ?? false

  return (
    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2 px-1">
      <span
        className="w-2 h-2 rounded-full"
        style={{ background: running ? '#22c55e' : '#4b5563' }}
      />
      <span style={{ color: running ? '#22c55e' : '#6b7280' }}>
        {running ? 'Running' : 'Stopped'}
      </span>

      {status?.fps !== undefined && (
        <>
          <span className="text-white/20">·</span>
          <span>{status.fps} fps</span>
        </>
      )}

      {status?.mock && (
        <>
          <span className="text-white/20">·</span>
          <span
            className="px-1.5 py-0.5 rounded text-xs font-bold"
            style={{ background: 'rgba(245,158,11,0.2)', color: '#fbbf24' }}
          >
            MOCK
          </span>
        </>
      )}
    </div>
  )
}
