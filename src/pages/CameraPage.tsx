import { useCamera } from '../hooks/useCamera'
import { CameraStream } from '../components/camera/CameraStream'
import { CameraControls } from '../components/camera/CameraControls'
import { CameraStatusBar } from '../components/camera/CameraStatusBar'
import { api } from '../api/client'

export function CameraPage() {
  const { status, loading, error, start, stop } = useCamera()
  const streamUrl = api.camera.streamUrl()

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 h-full">
      {/* Stream */}
      <div className="flex-1 min-w-0">
        <CameraStatusBar status={status} />
        <CameraStream
          running={status?.running ?? false}
          streamUrl={streamUrl}
          mock={status?.mock}
        />
      </div>

      {/* Controls sidebar */}
      <aside className="lg:w-56 shrink-0 flex flex-col gap-3">
        {error && (
          <p className="text-red-400 text-sm px-3 py-2 rounded-lg bg-red-500/10">{error}</p>
        )}
        <CameraControls status={status} loading={loading} onStart={start} onStop={stop} />
      </aside>
    </div>
  )
}
