import { useState } from 'react'
import { api } from '../../api/client'
import type { RGBStyle } from '../../api/types'

const STYLES: RGBStyle[] = ['monochromatic', 'breath', 'boom', 'bark', 'speak', 'listen']
const PRESET_COLORS: [string, string][] = [
  ['Red', '#ff0000'],
  ['Orange', '#ff8800'],
  ['Yellow', '#ffff00'],
  ['Green', '#00ff00'],
  ['Cyan', '#00ffff'],
  ['Blue', '#0000ff'],
  ['Purple', '#8800ff'],
  ['Pink', '#ff00aa'],
  ['White', '#ffffff'],
]

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function RGBControl() {
  const [style, setStyle] = useState<RGBStyle>('monochromatic')
  const [color, setColor] = useState('#00ffff')
  const [bps, setBps] = useState(1)
  const [brightness, setBrightness] = useState(1)

  const apply = () => {
    api.rgb.setMode({ style, color: hexToRgb(color), bps, brightness }).catch(() => {})
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs text-gray-500 uppercase tracking-wider">RGB Lighting</p>
      <div
        className="rounded-2xl p-4 flex flex-col gap-4"
        style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        {/* Style selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400">Style</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value as RGBStyle)}
            className="rounded-lg px-3 py-2 text-sm outline-none"
            style={{ background: '#1a1a28', color: '#f0f0f5', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            {STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Color swatches */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-gray-400">Color</label>
          <div className="flex flex-wrap gap-2">
            {PRESET_COLORS.map(([name, hex]) => (
              <button
                key={hex}
                title={name}
                onClick={() => setColor(hex)}
                className="w-7 h-7 rounded-full transition-all"
                style={{
                  background: hex,
                  boxShadow: color === hex ? `0 0 0 2px white, 0 0 0 4px ${hex}` : 'none',
                  transform: color === hex ? 'scale(1.15)' : 'scale(1)',
                }}
              />
            ))}
          </div>
        </div>

        {/* BPS slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Speed (BPS)</span>
            <span style={{ color: '#00d4ff' }}>{bps.toFixed(1)}</span>
          </div>
          <input
            type="range" min={0.1} max={5} step={0.1} value={bps}
            onChange={(e) => setBps(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: '#00d4ff' }}
          />
        </div>

        {/* Brightness slider */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-gray-400">
            <span>Brightness</span>
            <span style={{ color: '#00d4ff' }}>{Math.round(brightness * 100)}%</span>
          </div>
          <input
            type="range" min={0} max={1} step={0.05} value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{ accentColor: '#00d4ff' }}
          />
        </div>

        <button
          onClick={apply}
          className="py-2 rounded-xl text-sm font-medium transition-all active:scale-95"
          style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }}
        >
          Apply
        </button>
      </div>
    </div>
  )
}
