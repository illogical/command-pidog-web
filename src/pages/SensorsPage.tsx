import { SensorDashboard } from '../components/sensors/SensorDashboard'
import { useRobotStore } from '../stores/robotStore'

export function SensorsPage() {
  const wsConnected = useRobotStore((s) => s.wsConnected)

  return (
    <div className="flex flex-col">
      {!wsConnected && (
        <div
          className="mx-4 mt-4 px-4 py-2 rounded-xl text-sm text-yellow-400"
          style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
        >
          ⚠️ Not connected — sensor data may be stale
        </div>
      )}
      <SensorDashboard />
    </div>
  )
}
