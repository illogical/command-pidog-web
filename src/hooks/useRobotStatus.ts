import { useRobotStore } from '../stores/robotStore'

export function useRobotStatus() {
  return useRobotStore((s) => s.status)
}
