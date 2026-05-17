import { useState } from 'react'
import type { Product } from '../../lib/api'

type Color = Product['colors'][number]

interface Props {
  colors: Color[]
  onChange: (colors: Color[]) => void
}

const PRESETS: Color[] = [
  { name: 'Black',   hex: '#000000' },
  { name: 'White',   hex: '#FFFFFF' },
  { name: 'Navy',    hex: '#1B2A4A' },
  { name: 'Beige',   hex: '#D4B896' },
  { name: 'Brown',   hex: '#7B4F2E' },
  { name: 'Olive',   hex: '#6B6B3A' },
  { name: 'Red',     hex: '#C0392B' },
  { name: 'Grey',    hex: '#9E9E9E' },
  { name: 'Camel',   hex: '#C19A6B' },
  { name: 'Cream',   hex: '#FFFDD0' },
]

export function ColorPicker({ colors, onChange }: Props) {
  const [name, setName] = useState('')
  const [hex, setHex] = useState('#000000')

  const has = (h: string) => colors.some(c => c.hex.toLowerCase() === h.toLowerCase())

  const add = (c: Color) => { if (!has(c.hex)) onChange([...colors, c]) }
  const remove = (h: string) => onChange(colors.filter(c => c.hex !== h))

  const addCustom = () => {
    const n = name.trim()
    if (!n) return
    add({ name: n, hex })
    setName('')
    setHex('#000000')
  }

  return (
    <div className="space-y-4">
      {/* Preset swatches */}
      <div className="flex flex-wrap gap-2.5">
        {PRESETS.map(p => {
          const active = has(p.hex)
          return (
            <button
              key={p.hex}
              type="button"
              title={p.name}
              onClick={() => active ? remove(p.hex) : add(p)}
              className={`relative w-9 h-9 rounded-full border-2 transition-all group ${
                active
                  ? 'border-black scale-110 shadow-md'
                  : 'border-gray-200 hover:border-gray-500 hover:scale-105'
              }`}
              style={{ backgroundColor: p.hex }}
            >
              {/* Checkmark for selected */}
              {active && (
                <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
                  p.hex === '#FFFFFF' || p.hex === '#FFFDD0' || p.hex === '#D4B896' ? 'text-black' : 'text-white'
                }`}>
                  ✓
                </span>
              )}
              {/* Tooltip */}
              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-2 py-0.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {p.name}
              </span>
            </button>
          )
        })}
      </div>

      {/* Custom color row */}
      <div className="flex gap-2 items-center">
        <div className="relative flex-shrink-0">
          <input
            type="color"
            value={hex}
            onChange={e => setHex(e.target.value)}
            className="w-10 h-10 border border-gray-200 cursor-pointer rounded-sm p-0.5 opacity-0 absolute inset-0"
          />
          <div
            className="w-10 h-10 border-2 border-gray-200 rounded-sm cursor-pointer flex items-center justify-center"
            style={{ backgroundColor: hex }}
          >
            <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        </div>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          placeholder="Custom color name (e.g. Burgundy)"
          className="flex-1 border border-gray-200 px-3 py-2.5 text-xs focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
        />
        <button
          type="button"
          onClick={addCustom}
          className="px-4 py-2.5 bg-gray-100 hover:bg-black hover:text-white text-gray-700 text-xs font-bold uppercase tracking-widest transition-all flex-shrink-0"
        >
          Add
        </button>
      </div>

      {/* Selected colors */}
      {colors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {colors.map(c => (
            <div
              key={c.hex}
              className="flex items-center gap-2 border border-gray-200 bg-white px-2.5 py-1.5 text-xs group hover:border-gray-400 transition-colors"
            >
              <span
                className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                style={{ backgroundColor: c.hex }}
              />
              <span className="font-medium text-gray-700">{c.name}</span>
              <button
                type="button"
                onClick={() => remove(c.hex)}
                className="text-gray-300 hover:text-red-500 transition-colors ml-0.5 leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
