import type { RecorderState } from '../../hooks/useVoiceRecorder'
import type { ChatResponse } from '../../api/types'
import { ACTIONS, BODY_PART_COLORS } from '../../lib/constants'

interface ResponseDisplayProps {
  state: RecorderState
  response: ChatResponse | null
}

function getBoxShadow(state: RecorderState): string {
  switch (state) {
    case 'processing_llm':
      return '0 0 0 2px rgba(239,221,68,0.5)'
    case 'success':
      return '0 0 0 2px rgba(52,199,89,0.5)'
    case 'error':
      return '0 0 0 3px rgba(239,68,68,1.0)'
    default:
      return '0 0 0 1px rgba(255,255,255,0.08)'
  }
}

const BODY_PART_BADGE_COLORS: Record<string, string> = {
  blue: 'rgba(59,130,246,0.25)',
  purple: 'rgba(139,92,246,0.25)',
  amber: 'rgba(245,158,11,0.25)',
  teal: 'rgba(20,184,166,0.25)',
}

const BODY_PART_TEXT_COLORS: Record<string, string> = {
  blue: '#60a5fa',
  purple: '#a78bfa',
  amber: '#fbbf24',
  teal: '#2dd4bf',
}

const ACTION_BODY_PART_MAP = new Map<string, string>(ACTIONS.map((a) => [a.name as string, a.bodyPart as string]))

function getBodyPartColor(actionName: string): { bg: string; text: string } {
  const bodyPart = ACTION_BODY_PART_MAP.get(actionName) ?? 'multi'
  const colorKey = BODY_PART_COLORS[bodyPart] ?? 'teal'
  return {
    bg: BODY_PART_BADGE_COLORS[colorKey] ?? BODY_PART_BADGE_COLORS.teal,
    text: BODY_PART_TEXT_COLORS[colorKey] ?? BODY_PART_TEXT_COLORS.teal,
  }
}

export function ResponseDisplay({ state, response }: ResponseDisplayProps) {
  const boxShadow = getBoxShadow(state)

  return (
    <div
      className="rounded-2xl px-4 py-3 transition-all duration-300"
      style={{
        background: '#111118',
        boxShadow,
        minHeight: '120px',
      }}
    >
      {response ? (
        <div className="flex flex-col gap-3">
          {response.answer && (
            <div
              className="text-sm rounded-xl px-3 py-2"
              style={{ background: 'rgba(0,212,255,0.06)', borderLeft: '3px solid rgba(0,212,255,0.4)' }}
            >
              <span className="text-gray-400 text-xs">PiDog says: </span>
              <span className="text-gray-100">{response.answer}</span>
            </div>
          )}

          {response.actions && response.actions.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {response.actions.map((action, i) => {
                const { bg, text } = getBodyPartColor(action)
                return (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: bg, color: text, border: `1px solid ${text}30` }}
                  >
                    {action}
                  </span>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">AI response will appear here…</p>
      )}
    </div>
  )
}
