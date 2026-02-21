import { useState, useEffect } from 'react'
import { api } from '../../api/client'

interface Provider {
  name: string
  available: boolean
  default_model: string
}

export function AgentStatus() {
  const [providers, setProviders] = useState<Provider[]>([])

  useEffect(() => {
    api.agent.providers().then(setProviders).catch(() => {})
  }, [])

  if (providers.length === 0) return null

  return (
    <div
      className="rounded-xl p-3 flex flex-col gap-2"
      style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <p className="text-xs text-gray-500 uppercase tracking-wider">AI Providers</p>
      {providers.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: p.available ? '#22c55e' : '#6b7280' }}
          />
          <span className="text-gray-300 capitalize">{p.name}</span>
          <span className="text-gray-600">· {p.default_model}</span>
        </div>
      ))}
    </div>
  )
}
