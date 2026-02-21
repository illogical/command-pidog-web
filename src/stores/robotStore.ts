import { create } from 'zustand'
import type { SensorData, RobotStatus, ActionQueueStatus, ChatMessage, LogEntry } from '../api/types'

interface RobotStore {
  // Connection
  wsConnected: boolean
  setWsConnected: (v: boolean) => void

  // Live sensor data (updated at 5Hz via WebSocket)
  sensors: SensorData | null
  setSensors: (s: SensorData) => void

  // Robot status (updated at 0.2Hz via WebSocket)
  status: RobotStatus | null
  setStatus: (s: RobotStatus) => void

  // Action queue status (updated on change)
  queueStatus: ActionQueueStatus | null
  setQueueStatus: (s: ActionQueueStatus) => void

  // Agent chat history
  chatHistory: ChatMessage[]
  addMessage: (m: ChatMessage) => void
  clearChat: () => void

  // Live log entries from WS
  logs: LogEntry[]
  addLog: (entry: LogEntry) => void
  clearLogs: () => void
}

export const useRobotStore = create<RobotStore>((set) => ({
  wsConnected: false,
  setWsConnected: (wsConnected) => set({ wsConnected }),

  sensors: null,
  setSensors: (sensors) => set({ sensors }),

  status: null,
  setStatus: (status) => set({ status }),

  queueStatus: null,
  setQueueStatus: (queueStatus) => set({ queueStatus }),

  chatHistory: [],
  addMessage: (m) => set((s) => ({ chatHistory: [...s.chatHistory, m] })),
  clearChat: () => set({ chatHistory: [] }),

  logs: [],
  addLog: (entry) => set((s) => ({ logs: [...s.logs.slice(-999), entry] })),
  clearLogs: () => set({ logs: [] }),
}))
