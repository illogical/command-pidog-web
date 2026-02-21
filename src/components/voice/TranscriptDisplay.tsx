import type { RecorderState } from '../../hooks/useVoiceRecorder'

interface TranscriptDisplayProps {
  state: RecorderState
  transcript: string
}

function getBoxShadow(state: RecorderState): string {
  switch (state) {
    case 'recording':
      return '0 0 0 2px rgba(239,68,68,0.5)'
    case 'processing_stt':
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

export function TranscriptDisplay({ state, transcript }: TranscriptDisplayProps) {
  return (
    <textarea
      readOnly
      rows={2}
      value={transcript}
      placeholder="Your transcription will appear here…"
      className="w-full resize-none rounded-2xl px-4 py-3 text-sm transition-all duration-300 outline-none"
      style={{
        background: '#111118',
        color: transcript ? '#f0f0f5' : '#6b7280',
        boxShadow: getBoxShadow(state),
        border: 'none',
        fontFamily: 'inherit',
      }}
    />
  )
}
