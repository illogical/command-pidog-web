import { api } from '../../api/client'

export function EmergencyStop() {
  const handleStop = async () => {
    try {
      await api.actions.stop()
    } catch {
      // silently ignore — the stop command is best-effort
    }
  }

  return (
    <button
      onClick={handleStop}
      className="w-full py-3 rounded-xl font-bold text-white text-sm uppercase tracking-widest transition-all active:scale-95"
      style={{
        background: 'linear-gradient(135deg, #dc2626, #991b1b)',
        boxShadow: '0 0 20px rgba(220,38,38,0.4)',
        border: '1px solid rgba(220,38,38,0.5)',
      }}
    >
      ⛔ Emergency Stop
    </button>
  )
}
