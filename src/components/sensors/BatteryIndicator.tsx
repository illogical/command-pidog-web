import { Battery, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react'

interface BatteryIndicatorProps {
  voltage?: number
  low?: boolean
}

export function BatteryIndicator({ voltage, low }: BatteryIndicatorProps) {
  const color = !voltage
    ? '#9ca3af'
    : voltage >= 7.0
    ? '#22c55e'
    : voltage >= 6.5
    ? '#eab308'
    : '#ef4444'

  const Icon = !voltage
    ? Battery
    : voltage >= 7.5
    ? BatteryFull
    : voltage >= 6.5
    ? BatteryMedium
    : BatteryLow

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <p className="text-xs text-gray-500 uppercase tracking-wider">Battery</p>
      <div className="flex items-center gap-3">
        <Icon size={28} style={{ color }} />
        <div>
          <p className="text-2xl font-bold" style={{ color }}>
            {voltage ? `${voltage.toFixed(1)}V` : '—'}
          </p>
          {low && (
            <p className="text-xs text-yellow-400 font-medium">⚠️ Low battery</p>
          )}
        </div>
      </div>
      {voltage && (
        <div className="w-full rounded-full h-2 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(100, Math.max(0, ((voltage - 6.0) / 2.4) * 100))}%`,
              background: color,
            }}
          />
        </div>
      )}
    </div>
  )
}
