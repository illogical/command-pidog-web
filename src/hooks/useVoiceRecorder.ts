import { useState, useRef, useCallback } from 'react'
import { api } from '../api/client'
import {
  toWavBlob,
  computeRMS,
  getSupportedMimeType,
  SILENCE_THRESHOLD,
  SILENCE_DURATION_MS,
  MAX_RECORDING_MS,
} from '../lib/audio'
import type { ChatResponse } from '../api/types'

export type RecorderState =
  | 'idle'
  | 'requesting_permission'
  | 'recording'
  | 'processing_stt'
  | 'processing_llm'
  | 'success'
  | 'error'

export interface VoiceRecorderResult {
  state: RecorderState
  transcript: string
  response: ChatResponse | null
  error: string | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  touchProps: {
    onTouchStart: (e: React.TouchEvent) => void
    onTouchEnd: () => void
  }
  mouseProps: {
    onMouseDown: () => void
    onMouseUp: () => void
  }
}

export function useVoiceRecorder(): VoiceRecorderResult {
  const [state, setState] = useState<RecorderState>('idle')
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState<ChatResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const maxTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const rafRef = useRef<number | null>(null)
  const permissionGrantedRef = useRef(false)
  const touchStartCountRef = useRef(0)
  const isRecordingRef = useRef(false)

  const clearTimers = () => {
    if (silenceTimerRef.current) { clearTimeout(silenceTimerRef.current); silenceTimerRef.current = null }
    if (maxTimerRef.current) { clearTimeout(maxTimerRef.current); maxTimerRef.current = null }
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null }
  }

  const processAudio = useCallback(async (chunks: Blob[], mimeType: string) => {
    setState('processing_stt')
    try {
      const rawBlob = new Blob(chunks, { type: mimeType })
      let wavBlob: Blob
      try {
        const audioCtx = new AudioContext()
        const arrayBuffer = await rawBlob.arrayBuffer()
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)
        const channelData = audioBuffer.getChannelData(0)
        wavBlob = toWavBlob([channelData], audioBuffer.sampleRate)
        await audioCtx.close()
      } catch {
        wavBlob = rawBlob
      }

      setState('processing_llm')
      const resp = await api.agent.voice(wavBlob)
      setTranscript(resp.transcription || '')
      setResponse(resp)
      setState('success')
      setTimeout(() => setState('idle'), 2000)
    } catch (e) {
      setError(String(e))
      setState('error')
      setTimeout(() => { setState('idle'); setError(null) }, 3000)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (!isRecordingRef.current) return
    isRecordingRef.current = false
    clearTimers()

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
  }, [])

  const startRecording = useCallback(async () => {
    if (isRecordingRef.current) return
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      permissionGrantedRef.current = true
      streamRef.current = stream
      isRecordingRef.current = true
      chunksRef.current = []

      // Set up silence detection
      const audioCtx = new AudioContext()
      audioContextRef.current = audioCtx
      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 2048
      analyserRef.current = analyser
      const source = audioCtx.createMediaStreamSource(stream)
      source.connect(analyser)
      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const mimeType = getSupportedMimeType()
      const mr = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)
      mediaRecorderRef.current = mr

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mr.onstop = () => {
        const chunks = chunksRef.current.slice()
        const mime = mr.mimeType || mimeType
        processAudio(chunks, mime)
      }

      mr.start(100)
      setState('recording')

      // Silence detection loop
      let silenceStart: number | null = null
      const detect = () => {
        if (!isRecordingRef.current) return
        const rms = computeRMS(analyser, dataArray)
        if (rms < SILENCE_THRESHOLD) {
          if (silenceStart === null) silenceStart = Date.now()
          else if (Date.now() - silenceStart > SILENCE_DURATION_MS) {
            stopRecording()
            return
          }
        } else {
          silenceStart = null
        }
        rafRef.current = requestAnimationFrame(detect)
      }
      rafRef.current = requestAnimationFrame(detect)

      // Max duration cutoff
      maxTimerRef.current = setTimeout(() => stopRecording(), MAX_RECORDING_MS)
    } catch (e) {
      setError(String(e))
      setState('error')
      setTimeout(() => { setState('idle'); setError(null) }, 3000)
    }
  }, [stopRecording, processAudio])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault()
    touchStartCountRef.current += 1
    if (touchStartCountRef.current === 1) {
      // First touch: request permission only
      setState('requesting_permission')
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        permissionGrantedRef.current = true
        stream.getTracks().forEach((t) => t.stop())
        setState('idle')
      }).catch(() => {
        setState('idle')
      })
    } else {
      // Subsequent touches: start recording
      startRecording()
    }
  }, [startRecording])

  const handleTouchEnd = useCallback(() => {
    stopRecording()
  }, [stopRecording])

  const handleMouseDown = useCallback(() => {
    startRecording()
  }, [startRecording])

  const handleMouseUp = useCallback(() => {
    stopRecording()
  }, [stopRecording])

  return {
    state,
    transcript,
    response,
    error,
    startRecording,
    stopRecording,
    touchProps: {
      onTouchStart: handleTouchStart,
      onTouchEnd: handleTouchEnd,
    },
    mouseProps: {
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
    },
  }
}
