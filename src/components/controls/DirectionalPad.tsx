import { useRef } from 'react'
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Square } from 'lucide-react'
import { api } from '../../api/client'

const REPEAT_INTERVAL = 500

function DPadButton({
  label,
  icon: Icon,
  action,
  repeat = true,
}: {
  label: string
  icon: React.ElementType
  action: string
  repeat?: boolean
}) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const sendAction = async (name: string) => {
    try {
      await api.actions.execute({ actions: [name], speed: 98 })
    } catch {
      // ignore
    }
  }

  const handlePressStart = () => {
    sendAction(action)
    if (repeat) {
      intervalRef.current = setInterval(() => sendAction(action), REPEAT_INTERVAL)
    }
  }

  const handlePressEnd = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (repeat) {
      api.actions.execute({ actions: ['stop'], speed: 98 }).catch(() => {})
    }
  }

  return (
    <button
      aria-label={label}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={(e) => { e.preventDefault(); handlePressStart() }}
      onTouchEnd={handlePressEnd}
      className="flex items-center justify-center w-14 h-14 rounded-xl transition-all active:scale-90 select-none"
      style={{
        background: 'rgba(0,212,255,0.1)',
        border: '1px solid rgba(0,212,255,0.2)',
        color: '#00d4ff',
        touchAction: 'none',
      }}
    >
      <Icon size={22} />
    </button>
  )
}

export function DirectionalPad() {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Movement</p>
      <div className="grid grid-cols-3 gap-2">
        <div />
        <DPadButton label="Forward" icon={ArrowUp} action="forward" />
        <div />
        <DPadButton label="Turn Left" icon={ArrowLeft} action="turn left" />
        <DPadButton label="Stop" icon={Square} action="stop" repeat={false} />
        <DPadButton label="Turn Right" icon={ArrowRight} action="turn right" />
        <div />
        <DPadButton label="Backward" icon={ArrowDown} action="backward" />
        <div />
      </div>
    </div>
  )
}
