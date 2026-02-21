import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useWebSocket } from './hooks/useWebSocket'
import { Layout } from './components/layout/Layout'
import { VoicePage } from './pages/VoicePage'
import { ControlPage } from './pages/ControlPage'
import { CameraPage } from './pages/CameraPage'
import { SensorsPage } from './pages/SensorsPage'
import { AgentPage } from './pages/AgentPage'
import { LogsPage } from './pages/LogsPage'

function AppRoutes() {
  useWebSocket()
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<VoicePage />} />
        <Route path="/control" element={<ControlPage />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/sensors" element={<SensorsPage />} />
        <Route path="/agent" element={<AgentPage />} />
        <Route path="/logs" element={<LogsPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}

