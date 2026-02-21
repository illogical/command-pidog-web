export const ACTIONS = [
  // Movement
  { name: 'forward', bodyPart: 'legs', icon: '⬆️' },
  { name: 'backward', bodyPart: 'legs', icon: '⬇️' },
  { name: 'turn left', bodyPart: 'legs', icon: '↰' },
  { name: 'turn right', bodyPart: 'legs', icon: '↱' },
  { name: 'stop', bodyPart: 'legs', icon: '⏹' },
  // Postures
  { name: 'stand', bodyPart: 'legs', icon: '🐕' },
  { name: 'sit', bodyPart: 'legs', icon: '🪑' },
  { name: 'lie', bodyPart: 'legs', icon: '😴' },
  // Expressions
  { name: 'bark', bodyPart: 'multi', icon: '🗣️' },
  { name: 'bark harder', bodyPart: 'multi', icon: '📢' },
  { name: 'pant', bodyPart: 'head', icon: '😛' },
  { name: 'howling', bodyPart: 'multi', icon: '🌕' },
  { name: 'wag tail', bodyPart: 'tail', icon: '🐾' },
  { name: 'shake head', bodyPart: 'head', icon: '↔️' },
  { name: 'nod', bodyPart: 'head', icon: '👍' },
  { name: 'think', bodyPart: 'head', icon: '🤔' },
  { name: 'recall', bodyPart: 'head', icon: '💭' },
  { name: 'fluster', bodyPart: 'head', icon: '😵' },
  { name: 'surprise', bodyPart: 'multi', icon: '😲' },
  // Social
  { name: 'handshake', bodyPart: 'multi', icon: '🤝' },
  { name: 'high five', bodyPart: 'multi', icon: '🙏' },
  { name: 'lick hand', bodyPart: 'multi', icon: '👅' },
  { name: 'scratch', bodyPart: 'legs', icon: '🐾' },
  // Physical
  { name: 'stretch', bodyPart: 'multi', icon: '🧘' },
  { name: 'push up', bodyPart: 'multi', icon: '💪' },
  { name: 'twist body', bodyPart: 'multi', icon: '🌀' },
  { name: 'relax neck', bodyPart: 'head', icon: '🧖' },
  // Idle
  { name: 'doze off', bodyPart: 'legs', icon: '💤' },
  { name: 'waiting', bodyPart: 'head', icon: '⏳' },
  { name: 'feet shake', bodyPart: 'legs', icon: '🦶' },
] as const

export const SERVO_LIMITS = {
  head: { yaw: [-90, 90] as [number, number], roll: [-70, 70] as [number, number], pitch: [-45, 30] as [number, number] },
  tail: { angle: [-90, 90] as [number, number] },
} as const

export const BODY_PART_COLORS: Record<string, string> = {
  legs: 'blue',
  head: 'purple',
  tail: 'amber',
  multi: 'teal',
}

export const LOG_LEVEL_COLORS: Record<string, string> = {
  DEBUG: 'text-gray-400',
  INFO: 'text-white',
  WARNING: 'text-yellow-400',
  ERROR: 'text-red-400',
  CRITICAL: 'text-red-600 font-bold',
}
