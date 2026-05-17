import { useMemo } from 'react'
import type { Order } from '../../lib/api'
import { OrderStatsBar } from './OrderStatsBar'
import { StatusBadge } from './StatusBadge'

interface Props {
  orders: Order[]
  onSelectOrder: (order: Order) => void
  productCount?: number
}

export function OverviewTab({ orders, onSelectOrder, productCount }: Props) {
  const recentOrders = useMemo(() => orders.slice(0, 6), [orders])

  // Build a simple 7-day revenue summary for the bar chart
  const revenueByDay = useMemo(() => {
    const days: Record<string, number> = {}
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = d.toLocaleDateString('en-NG', { weekday: 'short' })
      days[key] = 0
    }
    orders.forEach(o => {
      const d = new Date(o.createdAt)
      const key = d.toLocaleDateString('en-NG', { weekday: 'short' })
      if (key in days) days[key] += o.total
    })
    return Object.entries(days).map(([day, revenue]) => ({ day, revenue }))
  }, [orders])

  const maxRevenue = Math.max(...revenueByDay.map(d => d.revenue), 1)

  const statusCount = useMemo(() =>
    orders.reduce(
      (acc, o) => { acc[o.status]++; return acc },
      { pending: 0, processing: 0, shipped: 0, delivered: 0 } as Record<Order['status'], number>
    ), [orders]
  )

  return (
    <div className="p-6 space-y-6">
      {/* KPI Stats */}
      <OrderStatsBar orders={orders} productCount={productCount} />

      {/* Charts + breakdown row */}
      <div className="grid gap-6 lg:grid-cols-[1fr,280px]">

        {/* Revenue bar chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900 font-display">Revenue (7 days)</h3>
              <p className="text-xs text-gray-400 mt-0.5">Daily order totals</p>
            </div>
            <div className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">Last 7 days</div>
          </div>

          <div className="flex items-end gap-2 h-36">
            {revenueByDay.map(({ day, revenue }, i) => {
              const pct = (revenue / maxRevenue) * 100
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full flex flex-col justify-end" style={{ height: '110px' }}>
                    <div
                      className="w-full rounded-t-md transition-all duration-500"
                      style={{
                        height: `${Math.max(pct, revenue > 0 ? 4 : 0)}%`,
                        backgroundColor: revenue > 0 ? '#C9A84C' : '#f0f0f0',
                        animationDelay: `${i * 80}ms`,
                      }}
                      title={`₦${revenue.toLocaleString()}`}
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">{day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 font-display mb-5">Status Breakdown</h3>
          <div className="space-y-4">
            {(['pending', 'processing', 'shipped', 'delivered'] as Order['status'][]).map(status => {
              const count = statusCount[status]
              const pct = orders.length > 0 ? (count / orders.length) * 100 : 0
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1.5">
                    <StatusBadge status={status} size="sm" />
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: {
                          pending: '#F59E0B',
                          processing: '#3B82F6',
                          shipped: '#7C3AED',
                          delivered: '#10B981',
                        }[status],
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 font-display">Recent Orders</h3>
          <span className="text-xs text-gray-400">{orders.length} total</span>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
            <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm uppercase tracking-widest">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Customer</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-semibold hidden sm:table-cell">Items</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Total</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-semibold hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order, i) => (
                  <tr
                    key={order.id}
                    onClick={() => onSelectOrder(order)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors animate-fade-in-row"
                    style={{ animationDelay: `${i * 50}ms`, animationFillMode: 'backwards' }}
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                          {order.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{order.name}</p>
                          <p className="text-xs text-gray-400 truncate hidden sm:block">{order.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-sm text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-gray-900">₦{order.total.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={order.status} size="sm" />
                    </td>
                    <td className="px-4 py-3.5 hidden md:table-cell">
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
