import { useSensors } from '../../hooks/useSensors'
import { useRobotStore } from '../../stores/robotStore'
import { BatteryIndicator } from './BatteryIndicator'
import { DistanceGauge } from './DistanceGauge'
import { IMUDisplay } from './IMUDisplay'
import { TouchIndicator } from './TouchIndicator'

export function SensorDashboard() {
  const sensors = useSensors()
  const status = useRobotStore((s) => s.status)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
      <BatteryIndicator
        voltage={status?.battery?.voltage}
        low={status?.battery?.low}
      />
      <DistanceGauge distance={sensors?.distance ?? -1} />
      <IMUDisplay pitch={sensors?.imu?.pitch ?? 0} roll={sensors?.imu?.roll ?? 0} />
      <TouchIndicator touch={sensors?.touch ?? 'N'} />
    </div>
  )
}
