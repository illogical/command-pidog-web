import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { api } from '../../api/client'
import type { ActionInfo } from '../../api/types'
import { BODY_PART_COLORS } from '../../lib/constants'

const BODY_PART_TEXT_COLORS: Record<string, string> = {
  blue: '#60a5fa',
  purple: '#a78bfa',
  amber: '#fbbf24',
  teal: '#2dd4bf',
}
const BODY_PART_BG_COLORS: Record<string, string> = {
  blue: 'rgba(59,130,246,0.15)',
  purple: 'rgba(139,92,246,0.15)',
  amber: 'rgba(245,158,11,0.15)',
  teal: 'rgba(20,184,166,0.15)',
}

interface AvailableCommandsProps {
  onSelectCommand?: (name: string) => void
}

export function AvailableCommands({ onSelectCommand }: AvailableCommandsProps) {
  const [expanded, setExpanded] = useState(false)
  const [actions, setActions] = useState<ActionInfo[]>([])

  useEffect(() => {
    api.actions.list().then(setActions).catch(() => {})
  }, [])

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}>
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-400 hover:text-gray-200 transition-colors"
      >
        <span>
          {expanded ? 'Hide' : 'Show'} Available Commands ({actions.length || 30})
        </span>
        <ChevronDown
          size={16}
          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        />
      </button>

      <div
        style={{
          maxHeight: expanded ? '400px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease',
        }}
      >
        <div className="grid grid-cols-2 gap-1.5 px-4 pb-4">
          {actions.map((action) => {
            const color = BODY_PART_COLORS[action.body_part] ?? 'teal'
            const textColor = BODY_PART_TEXT_COLORS[color] ?? BODY_PART_TEXT_COLORS.teal
            const bg = BODY_PART_BG_COLORS[color] ?? BODY_PART_BG_COLORS.teal
            return (
              <button
                key={action.name}
                onClick={() => onSelectCommand?.(action.name)}
                className="px-2 py-1.5 rounded-lg text-xs text-left transition-all hover:brightness-125 active:scale-95 min-h-[44px] flex items-center"
                style={{ background: bg, color: textColor, border: `1px solid ${textColor}30` }}
              >
                {action.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
