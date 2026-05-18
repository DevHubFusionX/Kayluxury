import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api, type Product, type Category } from '../../lib/api'
import { ProductForm } from './ProductForm'
import { ProductListItem } from './ProductListItem'

type ViewMode = 'list' | 'grid'

export function ProductsTab() {
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [view, setView] = useState<ViewMode>('list')
  const [showForm, setShowForm] = useState(false)

  const { data: categoryDocs = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  })
  const CATEGORIES = ['All', ...categoryDocs.map(c => c.name)]

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products-admin'],
    queryFn: async () => {
      const res = await api.getProducts({ limit: 200 })
      return res.data
    },
    staleTime: 1000 * 30,
  })

  const filtered = products.filter(p => {
    const matchSearch = !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = categoryFilter === 'All' || p.category === categoryFilter
    return matchSearch && matchCat
  })

  const countByCategory = (cat: string) =>
    cat === 'All' ? products.length : products.filter(p => p.category === cat).length

  return (
    <div className="p-6 space-y-6">

      {/* Add product button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900 font-display text-lg">Product Catalogue</h2>
          <p className="text-xs text-gray-400 mt-0.5">{products.length} products total</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-widest text-black rounded-xl transition-all hover:opacity-90"
          style={{ backgroundColor: '#C9A84C' }}
        >
          <svg className={`w-4 h-4 transition-transform ${showForm ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showForm ? 'Close Form' : 'Add Product'}
        </button>
      </div>

      {/* Collapsible form panel */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm animate-scale-in">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="font-bold font-display text-gray-900">New Product</h3>
            <p className="text-xs text-gray-400 mt-0.5">Fill in all sections then publish</p>
          </div>
          <div className="px-6 py-6">
            <ProductForm onSuccess={() => setShowForm(false)} />
          </div>
        </div>
      )}

      {/* Product list panel */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">

        {/* List toolbar */}
        <div className="border-b border-gray-100">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <h3 className="font-bold text-gray-900 font-display">
              Products
              <span className="ml-2 text-gray-400 font-normal text-sm">({filtered.length})</span>
            </h3>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden sm:block">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="pl-8 pr-3 py-2 border border-gray-200 text-xs focus:outline-none focus:border-black w-44 transition-colors rounded-lg"
                />
              </div>

              {/* View toggle */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setView('list')}
                  className={`p-2 transition-colors ${view === 'list' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                  title="List view"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 transition-colors ${view === 'grid' ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                  title="Grid view"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Category filter tabs */}
          <div className="flex overflow-x-auto border-t border-gray-100" style={{ scrollbarWidth: 'none' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`flex-shrink-0 px-4 py-2.5 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px whitespace-nowrap ${
                  categoryFilter === cat
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-400 hover:text-black'
                }`}
              >
                {cat}
                <span className={`ml-1.5 text-[10px] ${categoryFilter === cat ? 'text-gray-500' : 'text-gray-300'}`}>
                  {countByCategory(cat)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className={view === 'grid'
            ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4'
            : 'divide-y divide-gray-100'
          }>
            {[...Array(6)].map((_, i) => (
              view === 'grid'
                ? <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl admin-shimmer" />
                : (
                  <div key={i} className="flex gap-3 p-4">
                    <div className="w-16 h-20 bg-gray-100 rounded-lg admin-shimmer flex-shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 bg-gray-100 admin-shimmer rounded w-2/3" />
                      <div className="h-2.5 bg-gray-100 admin-shimmer rounded w-1/3" />
                    </div>
                  </div>
                )
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-7 h-7 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-sm text-gray-400 uppercase tracking-widest">
              {search || categoryFilter !== 'All' ? 'No products match' : 'No products yet'}
            </p>
            {(search || categoryFilter !== 'All') && (
              <button
                onClick={() => { setSearch(''); setCategoryFilter('All') }}
                className="text-xs text-black underline underline-offset-2 uppercase tracking-widest"
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* Product list/grid */}
        {!isLoading && filtered.length > 0 && (
          view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {filtered.map(p => <ProductListItem key={p.id} product={p} view="grid" />)}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map(p => <ProductListItem key={p.id} product={p} view="list" />)}
            </div>
          )
        )}

        {/* Footer */}
        {!isLoading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-400">
              {filtered.length} of {products.length} products
              {(search || categoryFilter !== 'All') && (
                <button onClick={() => { setSearch(''); setCategoryFilter('All') }} className="ml-3 text-gray-500 hover:text-black underline underline-offset-2">
                  Clear filters
                </button>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
