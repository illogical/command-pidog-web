import { Outlet } from 'react-router-dom'
import { TabNav } from './TabNav'
import { StatusStrip } from './StatusStrip'

export function Layout() {
  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden" style={{ background: '#0a0a0f' }}>
      {/* Desktop sidebar nav */}
      <TabNav />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <StatusStrip />
        <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
