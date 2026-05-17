import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type Product } from '../../lib/api'
import { toast } from '../common/Toast'
import { ProductForm } from './ProductForm'

interface Props {
  product: Product
  view: 'list' | 'grid'
}

export function ProductListItem({ product, view }: Props) {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const deleteProduct = useMutation({
    mutationFn: () => api.deleteProduct(product.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products-admin'] })
      toast.success(`"${product.name}" deleted`)
    },
    onError: () => toast.error('Failed to delete product'),
  })

  const toggleStock = useMutation({
    mutationFn: () => api.updateProduct(product.id, { inStock: !product.inStock }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products-admin'] })
      toast.success('Stock updated')
    },
    onError: () => toast.error('Failed to update stock'),
  })

  // ── Grid Card view ──────────────────────────────────────────────────────────
  if (view === 'grid') {
    return (
      <>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow animate-fade-in-row">
          {/* Image */}
          <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
            {product.images[0] ? (
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Stock badge */}
            <div className="absolute top-2 left-2">
              <button
                onClick={() => toggleStock.mutate()}
                disabled={toggleStock.isPending}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest disabled:opacity-50 ${
                  product.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}
              >
                {product.inStock ? 'In Stock' : 'Out'}
              </button>
            </div>

            {/* Hover actions overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end justify-center pb-4 gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-100 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-2 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-bold text-sm text-gray-900 truncate">{product.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{product.category}</p>
            <p className="text-sm font-bold mt-1.5">₦{product.price.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2 flex-wrap">
              {product.colors.slice(0, 5).map(c => (
                <span
                  key={c.hex}
                  title={c.name}
                  className="w-3.5 h-3.5 rounded-full border border-gray-200"
                  style={{ backgroundColor: c.hex }}
                />
              ))}
              {product.sizes.length > 0 && (
                <span className="text-[10px] text-gray-400 ml-1">{product.sizes.slice(0, 3).join(' · ')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Delete confirm modal */}
        {confirmDelete && <DeleteConfirmModal name={product.name} onConfirm={() => { deleteProduct.mutate(); setConfirmDelete(false) }} onCancel={() => setConfirmDelete(false)} />}

        {/* Edit slide-over */}
        {editing && <EditSlideOver product={product} onClose={() => setEditing(false)} />}
      </>
    )
  }

  // ── List Row view ───────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex gap-4 p-4 hover:bg-gray-50 transition-colors group animate-fade-in-row">
        {/* Thumbnail */}
        <div className="w-16 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
          {product.images[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-sm text-gray-900 truncate">{product.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5 uppercase tracking-widest">
                {product.category} · ₦{product.price.toLocaleString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setEditing(true)}
                className="text-xs font-semibold text-gray-500 hover:text-black uppercase tracking-widest transition-colors px-2 py-1 rounded hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-xs font-semibold text-gray-400 hover:text-red-600 uppercase tracking-widest transition-colors px-2 py-1 rounded hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <button
              onClick={() => toggleStock.mutate()}
              disabled={toggleStock.isPending}
              className={`text-xs px-2.5 py-1 font-bold rounded-full uppercase tracking-widest transition-colors disabled:opacity-50 ${
                product.inStock
                  ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </button>

            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {product.images.length} img{product.images.length !== 1 ? 's' : ''}
            </span>

            {product.sizes.slice(0, 4).map(s => (
              <span key={s} className="text-xs border border-gray-200 px-1.5 py-0.5 text-gray-500 rounded">{s}</span>
            ))}
            {product.sizes.length > 4 && (
              <span className="text-xs text-gray-400">+{product.sizes.length - 4}</span>
            )}

            {product.colors.slice(0, 5).map(c => (
              <span
                key={c.hex}
                title={c.name}
                className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>

          {product.description && (
            <p className="text-xs text-gray-400 mt-1.5 line-clamp-1">{product.description}</p>
          )}
        </div>
      </div>

      {confirmDelete && <DeleteConfirmModal name={product.name} onConfirm={() => { deleteProduct.mutate(); setConfirmDelete(false) }} onCancel={() => setConfirmDelete(false)} />}
      {editing && <EditSlideOver product={product} onClose={() => setEditing(false)} />}
    </>
  )
}

// ── Sub-components ───────────────────────────────────────────────────────────

function DeleteConfirmModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 animate-fade-in" onClick={onCancel} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm animate-scale-in">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 className="text-center font-bold text-gray-900 font-display mb-1">Delete Product?</h3>
          <p className="text-center text-sm text-gray-500 mb-6">
            <span className="font-semibold">"{name}"</span> will be permanently removed.
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors">
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function EditSlideOver({ product, onClose }: { product: Product; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 animate-fade-in" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-[520px] bg-white z-50 flex flex-col shadow-2xl animate-slide-in-panel overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Editing Product</p>
            <h2 className="font-bold text-gray-900 font-display">{product.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto admin-scroll p-6">
          <ProductForm editProduct={product} onSuccess={onClose} />
        </div>
      </div>
    </>
  )
}
