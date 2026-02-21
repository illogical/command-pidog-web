import { useState, useRef } from 'react'
import { SERVO_LIMITS } from '../../lib/constants'
import { api } from '../../api/client'

interface SliderProps {
  label: string
  min: number
  max: number
  value: number
  onChange: (v: number) => void
  unit?: string
}

function Slider({ label, min, max, value, onChange, unit = '°' }: SliderProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs text-gray-400">
        <span>{label}</span>
        <span style={{ color: '#00d4ff' }}>{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{ accentColor: '#00d4ff' }}
      />
    </div>
  )
}

export function ServoSliders() {
  const [headYaw, setHeadYaw] = useState(0)
  const [headRoll, setHeadRoll] = useState(0)
  const [headPitch, setHeadPitch] = useState(0)
  const [tailAngle, setTailAngle] = useState(0)
  const headTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tailTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const debounceHead = (yaw: number, roll: number, pitch: number) => {
    if (headTimerRef.current) clearTimeout(headTimerRef.current)
    headTimerRef.current = setTimeout(() => {
      api.servos.head({ yaw, roll, pitch }).catch(() => {})
    }, 150)
  }

  const debounceTail = (angle: number) => {
    if (tailTimerRef.current) clearTimeout(tailTimerRef.current)
    tailTimerRef.current = setTimeout(() => {
      api.servos.tail({ angle }).catch(() => {})
    }, 150)
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray-500 uppercase tracking-wider">Servo Control</p>
      <div
        className="rounded-2xl p-4 flex flex-col gap-4"
        style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <p className="text-xs text-gray-400 font-medium">Head</p>
        <Slider
          label="Yaw"
          min={SERVO_LIMITS.head.yaw[0]}
          max={SERVO_LIMITS.head.yaw[1]}
          value={headYaw}
          onChange={(v) => { setHeadYaw(v); debounceHead(v, headRoll, headPitch) }}
        />
        <Slider
          label="Roll"
          min={SERVO_LIMITS.head.roll[0]}
          max={SERVO_LIMITS.head.roll[1]}
          value={headRoll}
          onChange={(v) => { setHeadRoll(v); debounceHead(headYaw, v, headPitch) }}
        />
        <Slider
          label="Pitch"
          min={SERVO_LIMITS.head.pitch[0]}
          max={SERVO_LIMITS.head.pitch[1]}
          value={headPitch}
          onChange={(v) => { setHeadPitch(v); debounceHead(headYaw, headRoll, v) }}
        />

        <p className="text-xs text-gray-400 font-medium mt-2">Tail</p>
        <Slider
          label="Angle"
          min={SERVO_LIMITS.tail.angle[0]}
          max={SERVO_LIMITS.tail.angle[1]}
          value={tailAngle}
          onChange={(v) => { setTailAngle(v); debounceTail(v) }}
        />
      </div>
    </div>
  )
}
