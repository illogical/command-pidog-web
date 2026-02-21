import { useRobotStore } from '../../stores/robotStore'
import { Battery, BatteryLow, Wifi, WifiOff } from 'lucide-react'

export function StatusStrip() {
  const wsConnected = useRobotStore((s) => s.wsConnected)
  const status = useRobotStore((s) => s.status)
  const queueStatus = useRobotStore((s) => s.queueStatus)

  const voltage = status?.battery?.voltage
  const low = status?.battery?.low
  const posture = status?.posture ?? queueStatus?.posture
  const action = status?.current_action ?? queueStatus?.current_action

  const voltageColor = !voltage
    ? '#9ca3af'
    : voltage >= 7.0
    ? '#22c55e'
    : voltage >= 6.5
    ? '#eab308'
    : '#ef4444'

  return (
    <div
      className="flex items-center gap-3 px-4 py-1.5 text-xs shrink-0 border-b border-white/10"
      style={{ background: '#0d0d14' }}
    >
      {/* WS status */}
      <span className="flex items-center gap-1.5">
        {wsConnected ? (
          <>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <Wifi size={12} className="text-green-400" />
          </>
        ) : (
          <>
            <span className="w-2 h-2 rounded-full bg-gray-500" />
            <WifiOff size={12} className="text-gray-500" />
          </>
        )}
      </span>

      <span className="text-white/20">·</span>

      {/* Battery */}
      <span className="flex items-center gap-1" style={{ color: voltageColor }}>
        {low ? <BatteryLow size={13} /> : <Battery size={13} />}
        {voltage ? `${voltage.toFixed(1)}V` : '—'}
      </span>

      {posture && (
        <>
          <span className="text-white/20">·</span>
          <span className="text-gray-400 capitalize">{posture}</span>
        </>
      )}

      {(action || !wsConnected) && (
        <>
          <span className="text-white/20">·</span>
          <span style={{ color: action ? '#00d4ff' : '#6b7280' }}>
            {action ?? (wsConnected ? 'Ready' : 'Disconnected')}
          </span>
        </>
      )}

      {low && (
        <span className="ml-auto flex items-center gap-1 text-yellow-400 font-medium">
          ⚠️ Battery low
        </span>
      )}
    </div>
  )
}
