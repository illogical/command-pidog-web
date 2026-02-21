import { useState } from 'react'
import { EmergencyStop } from '../components/controls/EmergencyStop'
import { DirectionalPad } from '../components/controls/DirectionalPad'
import { ActionGrid } from '../components/controls/ActionGrid'
import { ServoSliders } from '../components/controls/ServoSliders'
import { RGBControl } from '../components/controls/RGBControl'

export function ControlPage() {
  const [speed, setSpeed] = useState(50)

  return (
    <div className="flex flex-col gap-5 p-4 max-w-2xl mx-auto w-full">
      {/* Emergency stop sticky */}
      <div className="sticky top-0 z-10 pb-2" style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(4px)' }}>
        <EmergencyStop />
      </div>

      {/* Directional pad */}
      <div
        className="rounded-2xl p-4"
        style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <DirectionalPad />
      </div>

      {/* Speed control */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between text-xs text-gray-400">
          <span className="uppercase tracking-wider">Action Speed</span>
          <span style={{ color: '#00d4ff' }}>{speed}</span>
        </div>
        <input
          type="range" min={0} max={100} value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: '#00d4ff' }}
        />
      </div>

      {/* Action grid */}
      <ActionGrid speed={speed} />

      {/* Servo sliders */}
      <ServoSliders />

      {/* RGB */}
      <RGBControl />
    </div>
  )
}
