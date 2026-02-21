import { useState, useEffect } from 'react'
import { api } from '../api/client'
import type { CameraStatus } from '../api/types'

export function useCamera() {
  const [status, setStatus] = useState<CameraStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.camera.status().then(setStatus).catch(() => {})
  }, [])

  const start = async () => {
    setLoading(true)
    setError(null)
    try {
      setStatus(await api.camera.start())
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  const stop = async () => {
    setLoading(true)
    setError(null)
    try {
      setStatus(await api.camera.stop())
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  return { status, loading, error, start, stop }
}
