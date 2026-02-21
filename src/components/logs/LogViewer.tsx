import { useState, useRef, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { useRobotStore } from '../../stores/robotStore'
import type { LogEntry } from '../../api/types'

const LEVELS = ['ALL', 'DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'] as const
type LevelFilter = typeof LEVELS[number]

const LEVEL_TEXT: Record<string, string> = {
  DEBUG: 'text-gray-400',
  INFO: 'text-gray-100',
  WARNING: 'text-yellow-400',
  ERROR: 'text-red-400',
  CRITICAL: 'text-red-500 font-bold',
}

function LogRow({ entry }: { entry: LogEntry }) {
  const ts = new Date(entry.timestamp * 1000).toLocaleTimeString()
  const textClass = LEVEL_TEXT[entry.level] ?? 'text-gray-300'
  return (
    <div className={`flex gap-3 font-mono text-xs py-1 border-b border-white/5 ${textClass}`}>
      <span className="shrink-0 text-gray-500">{ts}</span>
      <span className="shrink-0 w-16 uppercase">{entry.level}</span>
      <span className="shrink-0 text-gray-500 truncate max-w-24">{entry.source}</span>
      <span className="break-all">{entry.message}</span>
    </div>
  )
}

export function LogViewer() {
  const logs = useRobotStore((s) => s.logs)
  const clearLogs = useRobotStore((s) => s.clearLogs)
  const [filter, setFilter] = useState<LevelFilter>('ALL')
  const [autoScroll, setAutoScroll] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const filtered: LogEntry[] = filter === 'ALL' ? logs : logs.filter((e) => e.level === filter)

  useEffect(() => {
    if (autoScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [filtered.length, autoScroll])

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div
        className="flex flex-wrap items-center gap-2 p-3 border-b shrink-0"
        style={{ borderColor: 'rgba(255,255,255,0.08)' }}
      >
        <div className="flex gap-1 flex-wrap">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className="px-2 py-0.5 rounded text-xs font-mono transition-colors"
              style={{
                background: filter === lvl ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.05)',
                color: filter === lvl ? '#00d4ff' : '#888',
                border: `1px solid ${filter === lvl ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={autoScroll}
              onChange={(e) => setAutoScroll(e.target.checked)}
              className="accent-cyan-400"
            />
            Auto-scroll
          </label>
          <button
            onClick={clearLogs}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-xs text-gray-400 transition-colors hover:text-red-400"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <Trash2 size={12} />
            Clear
          </button>
        </div>
      </div>

      {/* Log list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0">
        {filtered.length === 0 ? (
          <p className="text-gray-600 text-sm text-center mt-8">No log entries</p>
        ) : (
          filtered.map((entry, i) => <LogRow key={i} entry={entry} />)
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
