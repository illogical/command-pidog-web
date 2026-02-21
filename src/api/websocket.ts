import type { WSMessage, WSSubscribeMessage } from './types'

type MessageHandler = (msg: WSMessage) => void

const WS_URL = import.meta.env.VITE_WS_URL
  ? `${import.meta.env.VITE_WS_URL}/api/v1/ws`
  : `ws://${location.host}/api/v1/ws`

class PidogWebSocket {
  private ws: WebSocket | null = null
  private handlers: Set<MessageHandler> = new Set()
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null
  private intentionallyClosed = false

  connect(): void {
    if (this.ws?.readyState === WebSocket.OPEN) return
    this.intentionallyClosed = false
    this.ws = new WebSocket(WS_URL)

    this.ws.onopen = () => {
      this.send({ type: 'subscribe', channels: ['sensors', 'action_status', 'status', 'logs'] })
    }

    this.ws.onmessage = (e) => {
      try {
        const msg: WSMessage = JSON.parse(e.data)
        this.handlers.forEach((h) => h(msg))
      } catch {
        // ignore malformed messages
      }
    }

    this.ws.onclose = () => {
      if (!this.intentionallyClosed) {
        this.reconnectTimer = setTimeout(() => this.connect(), 3000)
      }
    }

    this.ws.onerror = () => this.ws?.close()
  }

  disconnect(): void {
    this.intentionallyClosed = true
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer)
    this.ws?.close()
    this.ws = null
  }

  subscribe(handler: MessageHandler): () => void {
    this.handlers.add(handler)
    return () => this.handlers.delete(handler)
  }

  send(msg: WSSubscribeMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg))
    }
  }

  get connected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

export const pidogWS = new PidogWebSocket()
