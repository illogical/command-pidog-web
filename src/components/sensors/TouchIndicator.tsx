interface TouchIndicatorProps {
  touch: 'N' | 'L' | 'R' | 'LS' | 'RS'
}

const TOUCH_LABELS: Record<string, string> = {
  N: 'No touch',
  L: 'Left tap',
  R: 'Right tap',
  LS: 'Left slide',
  RS: 'Right slide',
}

export function TouchIndicator({ touch }: TouchIndicatorProps) {
  const leftActive = touch === 'L' || touch === 'LS'
  const rightActive = touch === 'R' || touch === 'RS'
  const activeColor = '#00d4ff'

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-4"
      style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <p className="text-xs text-gray-500 uppercase tracking-wider">Touch</p>
      <div className="flex items-center justify-center gap-4">
        {/* Left sensor */}
        <div
          className="w-12 h-16 rounded-xl flex items-center justify-center text-xs font-bold transition-all"
          style={{
            background: leftActive ? `${activeColor}25` : 'rgba(255,255,255,0.05)',
            border: `2px solid ${leftActive ? activeColor : 'rgba(255,255,255,0.1)'}`,
            color: leftActive ? activeColor : '#4b5563',
            boxShadow: leftActive ? `0 0 12px ${activeColor}40` : 'none',
          }}
        >
          {touch === 'LS' ? '←' : 'L'}
        </div>

        {/* Dog head silhouette (simplified) */}
        <div
          className="w-16 h-20 rounded-full flex items-center justify-center text-2xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          🐕
        </div>

        {/* Right sensor */}
        <div
          className="w-12 h-16 rounded-xl flex items-center justify-center text-xs font-bold transition-all"
          style={{
            background: rightActive ? `${activeColor}25` : 'rgba(255,255,255,0.05)',
            border: `2px solid ${rightActive ? activeColor : 'rgba(255,255,255,0.1)'}`,
            color: rightActive ? activeColor : '#4b5563',
            boxShadow: rightActive ? `0 0 12px ${activeColor}40` : 'none',
          }}
        >
          {touch === 'RS' ? '→' : 'R'}
        </div>
      </div>
      <p className="text-center text-xs" style={{ color: touch === 'N' ? '#6b7280' : '#00d4ff' }}>
        {TOUCH_LABELS[touch]}
      </p>
    </div>
  )
}
