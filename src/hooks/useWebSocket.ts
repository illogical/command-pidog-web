import { useEffect } from 'react'
import { pidogWS } from '../api/websocket'
import { useRobotStore } from '../stores/robotStore'

export function useWebSocket() {
  const { setSensors, setStatus, setQueueStatus, setWsConnected, addLog } = useRobotStore()

  useEffect(() => {
    pidogWS.connect()

    const unsub = pidogWS.subscribe((msg) => {
      setWsConnected(true)
      if (msg.type === 'sensors') setSensors(msg.data)
      else if (msg.type === 'status') setStatus(msg.data)
      else if (msg.type === 'action_status') setQueueStatus(msg.data)
      else if (msg.type === 'log') addLog(msg.data)
    })

    // Poll connection status
    const interval = setInterval(() => {
      setWsConnected(pidogWS.connected)
    }, 1000)

    return () => {
      unsub()
      clearInterval(interval)
      pidogWS.disconnect()
    }
  }, [setSensors, setStatus, setQueueStatus, setWsConnected, addLog])
}
