import { LogViewer } from '../components/logs/LogViewer'

export function LogsPage() {
  return (
    <div
      className="h-full flex flex-col rounded-2xl m-4 overflow-hidden"
      style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <LogViewer />
    </div>
  )
}
