interface DistanceGaugeProps {
  distance: number
}

export function DistanceGauge({ distance }: DistanceGaugeProps) {
  const valid = distance >= 0
  const pct = valid ? Math.min(100, (distance / 300) * 100) : 0
  const color = !valid
    ? '#6b7280'
    : distance > 100
    ? '#22c55e'
    : distance > 30
    ? '#eab308'
    : '#ef4444'

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <p className="text-xs text-gray-500 uppercase tracking-wider">Distance</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold" style={{ color }}>
          {valid ? distance.toFixed(0) : '—'}
        </span>
        {valid && <span className="text-sm text-gray-400">cm</span>}
      </div>
      <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-600">
        <span>0 cm</span>
        <span>300 cm</span>
      </div>
    </div>
  )
}
