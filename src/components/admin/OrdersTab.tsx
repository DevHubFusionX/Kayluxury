import { useMemo, useState } from 'react'
import type { Order } from '../../lib/api'
import { StatusBadge } from './StatusBadge'
import { OrderDetailModal } from './OrderDetailModal'
import { OrderStatsBar } from './OrderStatsBar'

const STATUS_OPTIONS: Array<Order['status'] | 'all'> = ['all', 'pending', 'processing', 'shipped', 'delivered']

interface Props {
  orders: Order[]
  loading: boolean
}

type SortKey = 'date' | 'total' | 'name'
type SortDir = 'asc' | 'desc'

export function OrdersTab({ orders, loading }: Props) {
  const [filter, setFilter] = useState<'all' | Order['status']>('all')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const counts = useMemo(() =>
    orders.reduce(
      (acc, o) => { acc[o.status]++; return acc },
      { pending: 0, processing: 0, shipped: 0, delivered: 0 } as Record<Order['status'], number>
    ), [orders])

  const filtered = useMemo(() => {
    let result = orders
    if (filter !== 'all') result = result.filter(o => o.status === filter)
    if (search.trim()) result = result.filter(o => o.name.toLowerCase().includes(search.toLowerCase()))
    result = [...result].sort((a, b) => {
      let diff = 0
      if (sortKey === 'date') diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sortKey === 'total') diff = a.total - b.total
      if (sortKey === 'name') diff = a.name.localeCompare(b.name)
      return sortDir === 'asc' ? diff : -diff
    })
    return result
  }, [orders, filter, search, sortKey, sortDir])

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const SortIcon = ({ k }: { k: SortKey }) => (
    <svg className={`w-3 h-3 ml-1 inline ${sortKey === k ? 'text-gray-900' : 'text-gray-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {sortKey === k && sortDir === 'asc'
        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      }
    </svg>
  )

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-14 bg-white rounded-xl border border-gray-100 admin-shimmer" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Stats bar */}
        <OrderStatsBar orders={orders} />

        {/* Table card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 border-b border-gray-100">
            {/* Status filters */}
            <div className="flex flex-wrap gap-1.5 flex-1">
              {STATUS_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                    filter === s
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <span className="capitalize">{s === 'all' ? 'All' : s}</span>
                  <span className={`text-[10px] font-bold ${filter === s ? 'text-gray-300' : 'text-gray-400'}`}>
                    {s === 'all' ? orders.length : counts[s as Order['status']]}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-shrink-0">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search customer..."
                className="pl-9 pr-3 py-2 border border-gray-200 text-xs focus:outline-none focus:border-black w-44 transition-colors rounded-lg"
              />
            </div>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
              <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm uppercase tracking-widest">No orders match</p>
              {(filter !== 'all' || search) && (
                <button
                  onClick={() => { setFilter('all'); setSearch('') }}
                  className="text-xs text-gray-400 hover:text-black underline underline-offset-2 uppercase tracking-widest"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                      <button onClick={() => toggleSort('name')} className="flex items-center hover:text-gray-700 transition-colors">
                        Customer <SortIcon k="name" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-semibold hidden sm:table-cell">Items</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                      <button onClick={() => toggleSort('total')} className="flex items-center hover:text-gray-700 transition-colors">
                        Total <SortIcon k="total" />
                      </button>
                    </th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-semibold">Status</th>
                    <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest text-gray-400 font-semibold hidden md:table-cell">
                      <button onClick={() => toggleSort('date')} className="flex items-center hover:text-gray-700 transition-colors">
                        Date <SortIcon k="date" />
                      </button>
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((order, i) => (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors animate-fade-in-row group"
                      style={{ animationDelay: `${i * 30}ms`, animationFillMode: 'backwards' }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold flex-shrink-0">
                            {order.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{order.name}</p>
                            <p className="text-xs text-gray-400 truncate hidden sm:block">{order.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-sm text-gray-600">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-bold text-gray-900">₦{order.total.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge status={order.status} size="sm" />
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {filtered.length > 0 && (
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-400">Showing {filtered.length} of {orders.length} orders</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={() => setSelectedOrder(null)}
        />
      )}
    </>
  )
}
