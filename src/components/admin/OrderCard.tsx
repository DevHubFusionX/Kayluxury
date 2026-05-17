import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type Order } from '../../lib/api'
import { toast } from '../common/Toast'

const statusDot: Record<Order['status'], string> = {
  pending: 'bg-yellow-400',
  processing: 'bg-blue-500',
  shipped: 'bg-indigo-500',
  delivered: 'bg-green-500',
}

interface Props {
  order: Order
}

export function OrderCard({ order }: Props) {
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState(false)

  const updateStatus = useMutation({
    mutationFn: (status: Order['status']) => api.updateOrderStatus(order.id, status),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      toast.success(`Order status updated to ${status}`)
    },
    onError: () => toast.error('Failed to update order status'),
  })

  return (
    <div className="border border-gray-200 bg-white">
      {/* Header row */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 cursor-pointer select-none hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(v => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusDot[order.status]}`} />
          <div className="min-w-0">
            <p className="font-bold text-sm uppercase tracking-tight truncate">{order.name}</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest">
              {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <p className="font-bold text-sm">₦{order.total.toLocaleString()}</p>
          <select
            value={order.status}
            onClick={e => e.stopPropagation()}
            onChange={e => updateStatus.mutate(e.target.value as Order['status'])}
            disabled={updateStatus.isPending}
            className="border border-gray-200 px-2 py-1.5 text-xs uppercase tracking-widest focus:outline-none focus:border-black disabled:opacity-50 bg-white"
          >
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-gray-100 p-4 grid sm:grid-cols-2 gap-4 bg-gray-50">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Customer</p>
            <p className="text-sm font-medium">{order.name}</p>
            <p className="text-sm text-gray-600">{order.phone}</p>
            <p className="text-sm text-gray-600 mt-1">{order.address}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">Items</p>
            <ul className="space-y-1.5">
              {order.items.map((item, i) => (
                <li key={i} className="flex justify-between text-sm text-gray-700">
                  <span className="truncate mr-2">
                    {item.name}
                    {item.size ? <span className="text-gray-400"> · {item.size}</span> : null}
                    <span className="text-gray-400"> ×{item.quantity}</span>
                  </span>
                  <span className="flex-shrink-0 font-medium">₦{item.price.toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between text-sm font-bold">
              <span>Total</span>
              <span>₦{order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
