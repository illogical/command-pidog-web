import { useState } from 'react'
import { api } from '../api/client'
import { useRobotStore } from '../stores/robotStore'
import type { ChatRequest } from '../api/types'

export function useAgent() {
  const { chatHistory, addMessage } = useRobotStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (message: string, provider?: ChatRequest['provider']) => {
    addMessage({ role: 'user', content: message, timestamp: Date.now() })
    setLoading(true)
    setError(null)
    try {
      const resp = await api.agent.chat({ message, provider })
      addMessage({
        role: 'assistant',
        content: resp.answer,
        actions: resp.actions,
        timestamp: Date.now(),
      })
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  const sendVoice = async (audio: Blob) => {
    setLoading(true)
    setError(null)
    try {
      const resp = await api.agent.voice(audio)
      if (resp.transcription) {
        addMessage({ role: 'user', content: resp.transcription, timestamp: Date.now() })
      }
      addMessage({
        role: 'assistant',
        content: resp.answer,
        actions: resp.actions,
        timestamp: Date.now(),
      })
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  return { chatHistory, loading, error, sendMessage, sendVoice }
}
