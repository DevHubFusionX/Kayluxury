import { useEffect, useRef } from 'react'
import { useMutation } from '@tanstack/react-query'
import { api, type Order } from '../../lib/api'
import { toast } from '../common/Toast'
import { StatusBadge } from './StatusBadge'

interface Props {
  order: Order | null
  onClose: () => void
  onStatusChange?: (id: string, status: Order['status']) => void
}

export function OrderDetailModal({ order, onClose, onStatusChange }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  const updateStatus = useMutation({
    mutationFn: (status: Order['status']) => api.updateOrderStatus(order!.id, status),
    onSuccess: (_, status) => {
      toast.success(`Status updated to ${status}`)
      onStatusChange?.(order!.id, status)
    },
    onError: () => toast.error('Failed to update order status'),
  })

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!order) return null

  const orderId = `#${order.id.slice(-8).toUpperCase()}`
  const placedDate = new Date(order.createdAt).toLocaleDateString('en-NG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        ref={panelRef}
        className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white z-50 flex flex-col shadow-2xl animate-slide-in-panel"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Order</p>
            <h2 className="font-bold text-gray-900 font-display text-lg">{orderId}</h2>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={order.status} size="md" />
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close panel"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto admin-scroll p-6 space-y-6">

          {/* Status update */}
          <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Update Status</p>
              <p className="text-xs text-gray-600">Change order fulfillment stage</p>
            </div>
            <select
              value={order.status}
              onChange={e => updateStatus.mutate(e.target.value as Order['status'])}
              disabled={updateStatus.isPending}
              className="border border-gray-200 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-black disabled:opacity-50 bg-white font-medium"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          {/* Customer info */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 font-semibold">Customer</p>
            <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {order.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{order.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.phone}</p>
                  {order.email && (
                    <p className="text-xs text-gray-400 mt-0.5 select-all">{order.email}</p>
                  )}
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Delivery Address</p>
                <p className="text-sm text-gray-700 leading-relaxed">{order.address}</p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 font-semibold">
              Items ({order.items.length})
            </p>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.size ? `${item.size} · ` : ''}Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-900 flex-shrink-0 ml-4">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}

              {/* Total row */}
              <div className="flex items-center justify-between px-4 py-4 bg-gray-900">
                <span className="text-sm font-medium text-gray-300">Order Total</span>
                <span className="text-lg font-bold text-white font-display">₦{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Date */}
          <p className="text-xs text-gray-400 text-center pb-2">Placed on {placedDate}</p>
        </div>
      </div>
    </>
  )
}
