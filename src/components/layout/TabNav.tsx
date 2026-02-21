import { Link, useLocation } from 'react-router-dom'
import { Mic, Gamepad2, Camera, Activity, ScrollText } from 'lucide-react'

const TABS = [
  { path: '/', label: 'Voice', Icon: Mic },
  { path: '/control', label: 'Control', Icon: Gamepad2 },
  { path: '/camera', label: 'Camera', Icon: Camera },
  { path: '/sensors', label: 'Sensors', Icon: Activity },
  { path: '/logs', label: 'Logs', Icon: ScrollText },
]

export function TabNav() {
  const { pathname } = useLocation()

  return (
    <>
      {/* Mobile: bottom tab bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 flex border-t border-white/10"
        style={{ background: '#0d0d14', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {TABS.map(({ path, label, Icon }) => {
          const active = pathname === path
          return (
            <Link
              key={path}
              to={path}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors min-h-[56px]"
              style={{
                color: active ? '#00d4ff' : '#6b7280',
                textShadow: active ? '0 0 12px rgba(0,212,255,0.6)' : 'none',
              }}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Desktop: left sidebar */}
      <nav className="hidden lg:flex flex-col w-48 shrink-0 border-r border-white/10 py-4 gap-1"
        style={{ background: '#0d0d14' }}>
        <div className="px-4 mb-4">
          <h1 className="text-lg font-bold tracking-wider" style={{ color: '#00d4ff' }}>
            🐕 PiDog
          </h1>
        </div>
        {TABS.map(({ path, label, Icon }) => {
          const active = pathname === path
          return (
            <Link
              key={path}
              to={path}
              className="flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all"
              style={{
                background: active ? 'rgba(0,212,255,0.1)' : 'transparent',
                color: active ? '#00d4ff' : '#9ca3af',
                boxShadow: active ? 'inset 0 0 0 1px rgba(0,212,255,0.2)' : 'none',
              }}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}
