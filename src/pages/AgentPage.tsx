import { ChatPanel } from '../components/agent/ChatPanel'
import { AgentStatus } from '../components/agent/AgentStatus'

export function AgentPage() {
  return (
    <div className="flex flex-col h-full p-4 gap-3">
      <AgentStatus />
      <div
        className="flex-1 rounded-2xl overflow-hidden min-h-0"
        style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <ChatPanel />
      </div>
    </div>
  )
}
