import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Trash2 } from 'lucide-react'
import { useAgent } from '../../hooks/useAgent'
import { useRobotStore } from '../../stores/robotStore'
import type { ChatMessage } from '../../api/types'

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm"
        style={{
          background: isUser ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.06)',
          border: isUser ? '1px solid rgba(0,212,255,0.25)' : '1px solid rgba(255,255,255,0.08)',
          color: '#f0f0f5',
        }}
      >
        <p className="leading-relaxed">{msg.content}</p>
        {msg.actions && msg.actions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {msg.actions.map((a, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-full text-xs"
                style={{ background: 'rgba(0,212,255,0.2)', color: '#00d4ff' }}
              >
                {a}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-600 mt-1">
          {new Date(msg.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}

export function ChatPanel() {
  const { chatHistory, loading, error, sendMessage } = useAgent()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const clearChat = useRobotStore((s) => s.clearChat)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const handleSend = () => {
    const msg = input.trim()
    if (!msg || loading) return
    setInput('')
    sendMessage(msg)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {chatHistory.length === 0 && (
          <p className="text-center text-gray-600 text-sm mt-8">
            Send a message to control PiDog via AI
          </p>
        )}
        {chatHistory.map((msg, i) => (
          <MessageBubble key={i} msg={msg} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2.5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <Loader2 size={16} className="animate-spin text-gray-400" />
            </div>
          </div>
        )}
        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="flex gap-2 p-3 border-t"
        style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#0d0d14' }}
      >
        <button
          onClick={clearChat}
          className="p-2.5 rounded-xl text-gray-500 hover:text-gray-300 transition-colors"
          title="Clear chat"
        >
          <Trash2 size={16} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type a command…"
          className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
          style={{
            background: '#111118',
            color: '#f0f0f5',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-40"
          style={{ background: 'rgba(0,212,255,0.2)', color: '#00d4ff' }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  )
}
