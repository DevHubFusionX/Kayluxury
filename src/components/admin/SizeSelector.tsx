import { useState } from 'react'

const PRESETS = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']

interface Props {
  sizes: string[]
  onChange: (sizes: string[]) => void
}

export function SizeSelector({ sizes, onChange }: Props) {
  const [custom, setCustom] = useState('')

  const toggle = (size: string) =>
    onChange(sizes.includes(size) ? sizes.filter(s => s !== size) : [...sizes, size])

  const addCustom = () => {
    const val = custom.trim().toUpperCase()
    if (!val || sizes.includes(val)) { setCustom(''); return }
    onChange([...sizes, val])
    setCustom('')
  }

  const customSizes = sizes.filter(s => !PRESETS.includes(s))

  return (
    <div className="space-y-3">
      {/* Preset grid */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(s => {
          const active = sizes.includes(s)
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className={`h-10 min-w-[40px] px-3 border-2 text-xs font-bold tracking-wider transition-all ${
                active
                  ? 'border-black bg-black text-white'
                  : 'border-gray-200 text-gray-500 hover:border-gray-400 hover:text-black'
              }`}
            >
              {s}
            </button>
          )
        })}
      </div>

      {/* Custom size input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={custom}
          onChange={e => setCustom(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustom())}
          placeholder="Add custom size (e.g. 32, 10UK, One Size)"
          className="flex-1 border border-gray-200 px-3 py-2.5 text-xs focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
        />
        <button
          type="button"
          onClick={addCustom}
          className="px-4 py-2.5 bg-gray-100 hover:bg-black hover:text-white text-gray-700 text-xs font-bold uppercase tracking-widest transition-all"
        >
          Add
        </button>
      </div>

      {/* Custom size chips */}
      {customSizes.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {customSizes.map(s => (
            <span key={s} className="inline-flex items-center gap-1.5 bg-black text-white text-xs font-bold px-3 py-1.5 tracking-wider">
              {s}
              <button
                type="button"
                onClick={() => toggle(s)}
                className="text-white/60 hover:text-white leading-none"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Summary */}
      {sizes.length > 0 && (
        <p className="text-xs text-gray-400">
          {sizes.length} size{sizes.length !== 1 ? 's' : ''} selected: <span className="text-gray-600 font-medium">{sizes.join(', ')}</span>
        </p>
      )}
    </div>
  )
}
