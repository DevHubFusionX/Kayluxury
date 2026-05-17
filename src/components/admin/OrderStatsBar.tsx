import type { Order } from '../../lib/api'

interface StatItem {
  label: string
  value: string | number
  sub?: string
  icon: React.JSX.Element
  accent?: boolean
}

interface Props {
  orders: Order[]
  productCount?: number
}

export function OrderStatsBar({ orders, productCount }: Props) {
  const revenue = orders.reduce((s, o) => s + o.total, 0)
  const counts = orders.reduce(
    (acc, o) => { acc[o.status]++; return acc },
    { pending: 0, processing: 0, shipped: 0, delivered: 0 } as Record<Order['status'], number>
  )

  const stats: StatItem[] = [
    {
      label: 'Total Revenue',
      value: `₦${revenue.toLocaleString()}`,
      sub: `${orders.length} orders`,
      accent: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Orders',
      value: orders.length,
      sub: `${counts.processing} processing`,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    },
    {
      label: 'Pending',
      value: counts.pending,
      sub: counts.shipped > 0 ? `${counts.shipped} shipped` : 'Awaiting action',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Delivered',
      value: counts.delivered,
      sub: orders.length > 0
        ? `${Math.round((counts.delivered / orders.length) * 100)}% completion`
        : 'No orders yet',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ]

  if (productCount !== undefined) {
    stats.push({
      label: 'Products',
      value: productCount,
      sub: 'In catalogue',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    })
  }

  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 overflow-hidden relative group hover:shadow-md transition-shadow animate-fade-in-row ${
            s.accent ? 'col-span-2 sm:col-span-1' : ''
          }`}
          style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
        >
          {/* Gold accent top bar on first card */}
          {s.accent && (
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: '#C9A84C' }} />
          )}

          <div className="flex items-start justify-between mb-4">
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">{s.label}</p>
            <div className={`p-2 rounded-lg ${s.accent ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-400'}`}>
              {s.icon}
            </div>
          </div>

          <p className="text-3xl font-bold font-display text-gray-900 leading-none mb-1">
            {s.value}
          </p>
          {s.sub && (
            <p className="text-xs text-gray-400 mt-1.5">{s.sub}</p>
          )}
        </div>
      ))}
    </div>
  )
}
