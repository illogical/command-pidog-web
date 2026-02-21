// --- Sensor types ---
export interface IMUData {
  pitch: number
  roll: number
}

export interface SensorData {
  distance: number       // cm, -1 if error
  imu: IMUData
  touch: 'N' | 'L' | 'R' | 'LS' | 'RS'
  sound_direction: number  // 0-355 degrees, -1 if none
}

// --- Status types ---
export interface BatteryInfo {
  voltage: number
  low: boolean
}

export interface ServoPositions {
  head: [number, number, number]   // [yaw, roll, pitch]
  legs: [number, number, number, number, number, number, number, number]
  tail: [number]
}

export interface RobotStatus {
  battery: BatteryInfo
  posture: 'stand' | 'sit' | 'lie'
  action_state: 'standby' | 'think' | 'actions' | 'actions_done'
  current_action: string | null
  queue_size: number
  servos: ServoPositions
  uptime: number
}

// --- Action types ---
export interface ActionInfo {
  name: string
  description: string
  body_part: 'legs' | 'head' | 'tail' | 'multi'
  required_posture: 'stand' | 'sit' | 'lie' | null
  has_sound: boolean
}

export interface ActionRequest {
  actions: string[]
  speed?: number  // 0-100, default 50
}

export interface ActionResponse {
  success: boolean
  actions_queued: string[]
  message: string
}

export interface ActionQueueStatus {
  state: 'standby' | 'think' | 'actions' | 'actions_done'
  current_action: string | null
  queue_size: number
  posture: 'stand' | 'sit' | 'lie'
}

// --- RGB types ---
export type RGBStyle = 'monochromatic' | 'breath' | 'boom' | 'bark' | 'speak' | 'listen'

export interface RGBModeRequest {
  style: RGBStyle
  color: string | [number, number, number]
  bps?: number         // beats per second, default 1.0
  brightness?: number  // 0-1, default 1.0
}

// --- Agent types ---
export interface ChatRequest {
  message: string
  provider?: 'ollama' | 'openrouter'
  model?: string
}

export interface ChatResponse {
  answer: string
  actions: string[]
  transcription?: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  actions?: string[]
  timestamp: number
}

// --- Log types ---
export interface LogEntry {
  timestamp: number
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  message: string
  source: string
}

// --- WebSocket message types ---
export type WSMessage =
  | { type: 'sensors'; timestamp: number; data: SensorData }
  | { type: 'action_status'; timestamp: number; data: ActionQueueStatus }
  | { type: 'status'; timestamp: number; data: RobotStatus }
  | { type: 'log'; timestamp: number; data: LogEntry }

export interface WSSubscribeMessage {
  type: 'subscribe'
  channels: Array<'sensors' | 'action_status' | 'status' | 'logs'>
}

// --- Servo command types ---
export interface HeadCommand {
  yaw: number    // -90 to 90
  roll: number   // -70 to 70
  pitch: number  // -45 to 30
  speed?: number
}

export interface TailCommand {
  angle: number  // -90 to 90
  speed?: number
}

// --- Sound types ---
export interface SoundPlayRequest {
  name: string
  volume?: number  // 0-100
}

// --- Camera types ---
export interface CameraStatus {
  running: boolean
  mock: boolean
  fps: number
  vflip: boolean
  hflip: boolean
}
