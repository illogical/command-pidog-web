import { useRobotStore } from '../stores/robotStore'

export function useSensors() {
  return useRobotStore((s) => s.sensors)
}
