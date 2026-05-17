import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, type Order } from '../lib/api'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { AdminShell } from '../components/admin/AdminShell'
import { OverviewTab } from '../components/admin/OverviewTab'
import { OrdersTab } from '../components/admin/OrdersTab'
import { ProductsTab } from '../components/admin/ProductsTab'
import { OrderDetailModal } from '../components/admin/OrderDetailModal'
import type { Product } from '../lib/api'

type Tab = 'overview' | 'orders' | 'products'

export default function Admin() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [tab, setTab] = useState<Tab>('overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Real-time orders subscription
  useEffect(() => {
    const unsub = api.subscribeToOrders(
      (data) => {
        setOrders(data)
        setOrdersLoading(false)
      },
      () => {
        // Permission error or network issue — stop loading so UI isn't stuck
        setOrdersLoading(false)
      },
    )
    return unsub
  }, [])


  // Products count for overview stat card
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['products-admin'],
    queryFn: async () => {
      const res = await api.getProducts({ limit: 200 })
      return res.data
    },
    staleTime: 1000 * 30,
  })

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <>
      <AdminShell tab={tab} setTab={setTab} orders={orders} onLogout={handleLogout}>
        {tab === 'overview' && (
          <OverviewTab
            orders={orders}
            onSelectOrder={setSelectedOrder}
            productCount={products.length}
          />
        )}
        {tab === 'orders' && (
          <OrdersTab orders={orders} loading={ordersLoading} />
        )}
        {tab === 'products' && <ProductsTab />}
      </AdminShell>

      {/* Global order modal (opened from Overview tab) */}
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
