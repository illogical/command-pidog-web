import type {
  ActionInfo,
  ActionRequest,
  ActionResponse,
  ActionQueueStatus,
  ServoPositions,
  HeadCommand,
  TailCommand,
  SensorData,
  RGBModeRequest,
  RGBStyle,
  SoundPlayRequest,
  RobotStatus,
  ChatRequest,
  ChatResponse,
  LogEntry,
  CameraStatus,
} from './types'

const API_BASE = import.meta.env.VITE_API_URL || ''
const DEFAULT_AUDIO_FILENAME = 'audio.wav'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const resp = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ detail: resp.statusText }))
    throw new Error(err.detail || `HTTP ${resp.status}`)
  }
  return resp.json()
}

const get = <T>(path: string) => request<T>(path)
const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: 'POST', body: JSON.stringify(body) })
const del = <T>(path: string) => request<T>(path, { method: 'DELETE' })

export const api = {
  actions: {
    list: () => get<ActionInfo[]>('/api/v1/actions'),
    execute: (req: ActionRequest) => post<ActionResponse>('/api/v1/actions/execute', req),
    queueStatus: () => get<ActionQueueStatus>('/api/v1/actions/queue'),
    clearQueue: () => del<void>('/api/v1/actions/queue'),
    stop: () => post<void>('/api/v1/actions/stop'),
  },
  servos: {
    positions: () => get<ServoPositions>('/api/v1/servos/positions'),
    head: (cmd: HeadCommand) => post<void>('/api/v1/servos/head', cmd),
    tail: (cmd: TailCommand) => post<void>('/api/v1/servos/tail', cmd),
  },
  sensors: {
    all: () => get<SensorData>('/api/v1/sensors/all'),
  },
  rgb: {
    setMode: (req: RGBModeRequest) => post<void>('/api/v1/rgb/mode', req),
    styles: () => get<{ styles: RGBStyle[] }>('/api/v1/rgb/styles'),
    colors: () => get<{ colors: Record<string, [number, number, number]> }>('/api/v1/rgb/colors'),
  },
  sound: {
    play: (req: SoundPlayRequest) => post<void>('/api/v1/sound/play', req),
    list: () => get<Array<{ name: string; format: string }>>('/api/v1/sound/list'),
  },
  status: () => get<RobotStatus>('/api/v1/status'),
  agent: {
    chat: (req: ChatRequest) => post<ChatResponse>('/api/v1/agent/chat', req),
    voice: (audio: Blob, filename?: string) => {
      const form = new FormData()
      form.append('audio', audio, filename || DEFAULT_AUDIO_FILENAME)
      return request<ChatResponse>('/api/v1/agent/voice', { method: 'POST', body: form, headers: {} })
    },
    skill: () => get<{ skill: string }>('/api/v1/agent/skill'),
    providers: () =>
      get<Array<{ name: string; available: boolean; default_model: string }>>('/api/v1/agent/providers'),
  },
  logs: {
    list: (params?: { limit?: number; offset?: number; level?: string }) => {
      const qs = new URLSearchParams(params as Record<string, string>).toString()
      return get<{ entries: LogEntry[]; total: number }>(`/api/v1/logs${qs ? `?${qs}` : ''}`)
    },
  },
  camera: {
    status: () => get<CameraStatus>('/api/v1/camera/status'),
    start: () => post<CameraStatus>('/api/v1/camera/start'),
    stop: () => post<CameraStatus>('/api/v1/camera/stop'),
    snapshotUrl: () => `${API_BASE}/api/v1/camera/snapshot`,
    streamUrl: () => `${API_BASE}/api/v1/camera/stream`,
  },
}
