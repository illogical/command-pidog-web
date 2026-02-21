import { useVoiceRecorder } from '../hooks/useVoiceRecorder'
import { VoiceButton } from '../components/voice/VoiceButton'
import { TranscriptDisplay } from '../components/voice/TranscriptDisplay'
import { ResponseDisplay } from '../components/voice/ResponseDisplay'
import { AvailableCommands } from '../components/voice/AvailableCommands'

export function VoicePage() {
  const { state, transcript, response, touchProps, mouseProps } = useVoiceRecorder()

  const stateLabel =
    state === 'idle' ? 'Hold to speak' :
    state === 'requesting_permission' ? 'Tap again to record' :
    state === 'recording' ? 'Release to send…' :
    state === 'processing_stt' ? 'Transcribing…' :
    state === 'processing_llm' ? 'Thinking…' :
    state === 'success' ? 'Done!' :
    'Error'

  return (
    <div className="flex flex-col gap-4 p-4 max-w-lg mx-auto w-full">
      {/* Transcript area */}
      <TranscriptDisplay state={state} transcript={transcript} />

      {/* Response area */}
      <ResponseDisplay state={state} response={response} />

      {/* Mic button centered */}
      <div
        className="flex flex-col items-center gap-3 py-6"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.04) 0%, transparent 70%)',
          borderRadius: '24px',
        }}
      >
        <VoiceButton state={state} touchProps={touchProps} mouseProps={mouseProps} />
        <p
          className="text-sm font-medium transition-all"
          style={{
            color: state === 'recording' ? '#ef4444' :
                   state === 'success' ? '#22c55e' :
                   state === 'idle' ? '#00d4ff' : '#9ca3af',
          }}
        >
          {stateLabel}
        </p>
      </div>

      {/* Available commands collapsible */}
      <AvailableCommands />
    </div>
  )
}
