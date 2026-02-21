interface IMUDisplayProps {
  pitch: number
  roll: number
}

function AngleBar({ label, value, range }: { label: string; value: number; range: number }) {
  const pct = 50 + (value / range) * 50
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">{label}</span>
        <span style={{ color: '#00d4ff' }}>{value.toFixed(1)}°</span>
      </div>
      <div className="relative w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        {/* Center tick */}
        <div className="absolute left-1/2 top-0 w-px h-full bg-white/20" />
        {/* Bar */}
        <div
          className="absolute top-0 h-full rounded-full transition-all duration-100"
          style={{
            left: `${Math.min(pct, 50)}%`,
            width: `${Math.abs(pct - 50)}%`,
            background: Math.abs(value) > range * 0.6 ? '#ef4444' : '#00d4ff',
          }}
        />
      </div>
    </div>
  )
}

export function IMUDisplay({ pitch, roll }: IMUDisplayProps) {
  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-4"
      style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <p className="text-xs text-gray-500 uppercase tracking-wider">IMU</p>
      <AngleBar label="Pitch" value={pitch} range={90} />
      <AngleBar label="Roll" value={roll} range={90} />
    </div>
  )
}
