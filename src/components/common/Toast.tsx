import { useEffect, useState, useCallback } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastItem {
  id: string
  message: string
  type: ToastType
}

type Listener = (toasts: ToastItem[]) => void

let toasts: ToastItem[] = []
const listeners = new Set<Listener>()

function notify() {
  listeners.forEach((l) => l([...toasts]))
}

export const toast = {
  show(message: string, type: ToastType = 'info') {
    const id = Math.random().toString(36).slice(2)
    toasts = [...toasts, { id, message, type }]
    notify()
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id)
      notify()
    }, 3500)
  },
  success(message: string) { this.show(message, 'success') },
  error(message: string) { this.show(message, 'error') },
  info(message: string) { this.show(message, 'info') },
}

const icons: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  info: 'i',
}

const styles: Record<ToastType, string> = {
  success: 'bg-black text-white border-green-500',
  error: 'bg-black text-white border-red-500',
  info: 'bg-black text-white border-gray-400',
}

const iconStyles: Record<ToastType, string> = {
  success: 'bg-green-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-gray-500 text-white',
}

export function ToastContainer() {
  const [items, setItems] = useState<ToastItem[]>([])

  const sync = useCallback((next: ToastItem[]) => setItems(next), [])

  useEffect(() => {
    listeners.add(sync)
    return () => { listeners.delete(sync) }
  }, [sync])

  if (!items.length) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {items.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-4 py-3 border-l-4 shadow-lg min-w-[260px] max-w-sm animate-fade-in-up pointer-events-auto ${styles[t.type]}`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${iconStyles[t.type]}`}>
            {icons[t.type]}
          </span>
          <span className="text-sm font-medium">{t.message}</span>
        </div>
      ))}
    </div>
  )
}
