import { useState } from 'react'
import type { Order } from '../../lib/api'

type Tab = 'overview' | 'orders' | 'products'

interface NavItem {
  id: Tab
  label: string
  icon: JSX.Element
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    id: 'products',
    label: 'Products',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
]

interface Props {
  tab: Tab
  setTab: (t: Tab) => void
  orders: Order[]
  children: React.ReactNode
  onLogout?: () => void
}

export function AdminShell({ tab, setTab, orders, children, onLogout }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pendingCount = orders.filter(o => o.status === 'pending').length

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8f8f8]">
      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 flex flex-col
          bg-[#111] border-r border-[#222]
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-[#222]">
          <div
            className="w-8 h-8 flex-shrink-0 rounded flex items-center justify-center text-[10px] font-bold tracking-widest"
            style={{ backgroundColor: '#C9A84C', color: '#000' }}
          >
            K
          </div>
          <div>
            <p className="text-white font-bold font-display tracking-widest text-sm uppercase">Kayluxury</p>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: '#C9A84C' }}>Admin</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-6 px-3 space-y-1 admin-scroll overflow-y-auto">
          <p className="text-[10px] uppercase tracking-widest text-[#555] px-3 mb-3 font-semibold">Navigation</p>
          {NAV_ITEMS.map(item => {
            const isActive = tab === item.id
            return (
              <button
                key={item.id}
                onClick={() => { setTab(item.id); setMobileOpen(false) }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-150
                  ${isActive
                    ? 'text-white bg-[#1c1c1c]'
                    : 'text-[#888] hover:text-white hover:bg-[#1a1a1a]'
                  }
                `}
                style={isActive ? { borderLeft: '3px solid #C9A84C', paddingLeft: '9px' } : {}}
              >
                <span className={isActive ? 'text-white' : 'text-[#555]'}>{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
                {item.id === 'orders' && pendingCount > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: '#C9A84C', color: '#000' }}
                  >
                    {pendingCount}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-5 border-t border-[#222] space-y-3">
          <a
            href="/products"
            className="flex items-center gap-2 text-xs text-[#666] hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Store
          </a>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] text-[#555]">Live data</span>
          </div>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
          {/* Hamburger (mobile) */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Page title */}
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold font-display tracking-wide capitalize">
                {tab === 'overview' ? 'Dashboard Overview' : tab}
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                {new Date().toLocaleDateString('en-NG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>

           {/* Right actions */}
           <div className="flex items-center gap-3">
             {pendingCount > 0 && (
               <button
                 onClick={() => setTab('orders')}
                 className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors"
               >
                 <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                 {pendingCount} pending
               </button>
             )}
             <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center">
               <span className="text-white text-xs font-bold">A</span>
             </div>
             {onLogout && (
               <button
                 onClick={onLogout}
                 className="ml-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors"
                 title="Logout"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                     d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                 </svg>
               </button>
             )}
           </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto admin-scroll">
          {children}
        </main>
      </div>
    </div>
  )
}
