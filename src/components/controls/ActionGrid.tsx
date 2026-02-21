import { useState } from 'react'
import { ACTIONS, BODY_PART_COLORS } from '../../lib/constants'
import { api } from '../../api/client'
import { Loader2 } from 'lucide-react'

const BODY_PART_TEXT: Record<string, string> = {
  blue: '#60a5fa',
  purple: '#a78bfa',
  amber: '#fbbf24',
  teal: '#2dd4bf',
}
const BODY_PART_BG: Record<string, string> = {
  blue: 'rgba(59,130,246,0.12)',
  purple: 'rgba(139,92,246,0.12)',
  amber: 'rgba(245,158,11,0.12)',
  teal: 'rgba(20,184,166,0.12)',
}

interface ActionGridProps {
  speed: number
}

export function ActionGrid({ speed }: ActionGridProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAction = async (name: string) => {
    if (loading) return
    setLoading(name)
    setError(null)
    try {
      await api.actions.execute({ actions: [name], speed })
    } catch (e) {
      setError(String(e))
      setTimeout(() => setError(null), 3000)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-gray-500 uppercase tracking-wider">Actions</p>
      {error && (
        <p className="text-red-400 text-xs px-3 py-2 rounded-lg bg-red-500/10">{error}</p>
      )}
      <div className="grid grid-cols-3 gap-1.5">
        {ACTIONS.map(({ name, icon, bodyPart }) => {
          const colorKey = BODY_PART_COLORS[bodyPart] ?? 'teal'
          const textColor = BODY_PART_TEXT[colorKey]
          const bg = BODY_PART_BG[colorKey]
          const isLoading = loading === name
          return (
            <button
              key={name}
              onClick={() => handleAction(name)}
              disabled={!!loading}
              className="flex flex-col items-center gap-1 px-2 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-95 min-h-[56px] disabled:opacity-60"
              style={{ background: bg, color: textColor, border: `1px solid ${textColor}25` }}
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <span className="text-base leading-none">{icon}</span>
              )}
              <span className="leading-tight text-center">{name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
