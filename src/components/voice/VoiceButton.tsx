import { Mic, Loader2, ThumbsUp } from 'lucide-react'
import type { RecorderState } from '../../hooks/useVoiceRecorder'

interface VoiceButtonProps {
  state: RecorderState
  touchProps: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchEnd: () => void
  }
  mouseProps: {
    onMouseDown: () => void
    onMouseUp: () => void
  }
}

export function VoiceButton({ state, touchProps, mouseProps }: VoiceButtonProps) {
  const isRecording = state === 'recording'
  const isProcessing = state === 'processing_stt' || state === 'processing_llm'
  const isSuccess = state === 'success'
  const isIdle = state === 'idle' || state === 'requesting_permission'

  const buttonBg = isRecording
    ? 'rgba(239,68,68,0.9)'
    : isSuccess
    ? 'rgba(34,197,94,0.3)'
    : 'rgba(0,100,200,0.7)'

  const buttonShadow = isRecording
    ? '0 0 30px rgba(239,68,68,0.5), 0 0 60px rgba(239,68,68,0.2)'
    : isSuccess
    ? '0 0 30px rgba(34,197,94,0.4)'
    : '0 0 20px rgba(0,212,255,0.2)'

  const ariaLabel =
    isRecording ? 'Recording — release to send' :
    isProcessing ? 'Processing…' :
    isSuccess ? 'Success!' :
    state === 'requesting_permission' ? 'Requesting microphone permission' :
    'Hold to speak'

  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {/* Pulse ring 1 */}
      <div
        className="absolute rounded-full border-2 transition-all"
        style={{
          width: '100%',
          height: '100%',
          borderColor: 'rgba(0,212,255,0.4)',
          transform: isRecording ? 'scale(1.35)' : 'scale(1)',
          opacity: isRecording ? 0.5 : 0,
          transition: 'transform 0.6s ease, opacity 0.6s ease',
        }}
      />
      {/* Pulse ring 2 */}
      <div
        className="absolute rounded-full border-2 transition-all"
        style={{
          width: '100%',
          height: '100%',
          borderColor: 'rgba(0,212,255,0.25)',
          transform: isRecording ? 'scale(1.7)' : 'scale(1)',
          opacity: isRecording ? 0.4 : 0,
          transition: 'transform 0.6s ease 0.15s, opacity 0.6s ease 0.15s',
        }}
      />

      {/* Main button */}
      <button
        aria-label={ariaLabel}
        disabled={isProcessing}
        {...touchProps}
        {...mouseProps}
        className="relative z-10 w-24 h-24 rounded-full flex items-center justify-center select-none transition-all duration-200 cursor-pointer disabled:cursor-not-allowed"
        style={{
          background: buttonBg,
          boxShadow: buttonShadow,
          border: '2px solid rgba(0,212,255,0.3)',
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      >
        {isProcessing ? (
          <Loader2 size={36} className="animate-spin text-white/80" />
        ) : isSuccess ? (
          <ThumbsUp
            size={36}
            className="text-green-400"
            style={{ animation: 'bounce 0.5s ease infinite alternate' }}
          />
        ) : (
          <Mic
            size={36}
            className="transition-opacity"
            style={{
              color: isRecording ? 'rgba(255,255,255,0.5)' : '#00d4ff',
              filter: isIdle ? 'drop-shadow(0 0 8px rgba(0,212,255,0.5))' : 'none',
            }}
          />
        )}
      </button>

      <style>{`
        @keyframes bounce {
          from { transform: translateY(0); }
          to { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  )
}
