import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, type Category } from '../../lib/api'
import { toast } from '../common/Toast'

const inputCls = 'w-full border border-gray-200 px-3.5 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white placeholder:text-gray-300 rounded-lg'
const labelCls = 'block text-[11px] uppercase tracking-widest text-gray-400 mb-1.5 font-medium'

function CategoryForm({
  initial,
  onSave,
  onCancel,
  isPending,
}: {
  initial?: { name: string; image: string }
  onSave: (name: string, image: string) => void
  onCancel: () => void
  isPending: boolean
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [image, setImage] = useState(initial?.image ?? '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { toast.error('Category name is required'); return }
    if (!image.trim()) { toast.error('Image URL is required'); return }
    onSave(name.trim(), image.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelCls}>Category Name *</label>
        <input
          type="text" value={name} onChange={e => setName(e.target.value)}
          className={inputCls} placeholder="e.g. Hoodies"
        />
      </div>
      <div>
        <label className={labelCls}>Image URL *</label>
        <input
          type="url" value={image} onChange={e => setImage(e.target.value)}
          className={inputCls} placeholder="https://..."
        />
        {image && (
          <img src={image} alt="preview" className="mt-2 h-20 w-16 object-cover rounded-lg border border-gray-100" />
        )}
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit" disabled={isPending}
          className="flex-1 py-3 text-sm font-bold uppercase tracking-widest text-black rounded-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          style={{ backgroundColor: '#C9A84C' }}
        >
          {isPending && <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
          {initial ? 'Save Changes' : 'Create Category'}
        </button>
        <button
          type="button" onClick={onCancel}
          className="px-5 py-3 text-sm font-bold uppercase tracking-widest border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export function CategoriesTab() {
  const queryClient = useQueryClient()
  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] })
    queryClient.invalidateQueries({ queryKey: ['products-admin'] })
  }

  const createMutation = useMutation({
    mutationFn: ({ name, image }: { name: string; image: string }) => api.createCategory(name, image),
    onSuccess: () => { invalidate(); toast.success('Category created!'); setShowCreate(false) },
    onError: () => toast.error('Failed to create category'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, name, image }: { id: string; name: string; image: string }) =>
      api.updateCategory(id, { name, image }),
    onSuccess: () => { invalidate(); toast.success('Category updated!'); setEditingId(null) },
    onError: () => toast.error('Failed to update category'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteCategory(id),
    onSuccess: () => { invalidate(); toast.success('Category deleted'); setConfirmDeleteId(null) },
    onError: () => toast.error('Failed to delete category'),
  })

  const confirmDelete = categories.find(c => c.id === confirmDeleteId)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-gray-900 font-display text-lg">Categories</h2>
          <p className="text-xs text-gray-400 mt-0.5">{categories.length} categories total</p>
        </div>
        <button
          onClick={() => { setShowCreate(v => !v); setEditingId(null) }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold uppercase tracking-widest text-black rounded-xl transition-all hover:opacity-90"
          style={{ backgroundColor: '#C9A84C' }}
        >
          <svg className={`w-4 h-4 transition-transform ${showCreate ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {showCreate ? 'Close' : 'Add Category'}
        </button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 animate-scale-in">
          <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-widest">New Category</h3>
          <CategoryForm
            onSave={(name, image) => createMutation.mutate({ name, image })}
            onCancel={() => setShowCreate(false)}
            isPending={createMutation.isPending}
          />
        </div>
      )}

      {/* Category grid */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-xl admin-shimmer" />
            ))}
          </div>
        )}

        {!isLoading && categories.length === 0 && (
          <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
            <svg className="w-10 h-10 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-sm uppercase tracking-widest">No categories yet</p>
          </div>
        )}

        {!isLoading && categories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
            {categories.map(cat => (
              <div key={cat.id} className="group relative bg-gray-50 rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                {/* Edit inline panel */}
                {editingId === cat.id ? (
                  <div className="p-4">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-3">Editing</p>
                    <CategoryForm
                      initial={{ name: cat.name, image: cat.image }}
                      onSave={(name, image) => updateMutation.mutate({ id: cat.id, name, image })}
                      onCancel={() => setEditingId(null)}
                      isPending={updateMutation.isPending}
                    />
                  </div>
                ) : (
                  <>
                    <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={cat.image} alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-xs uppercase tracking-widest truncate">{cat.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{cat.count} product{cat.count !== 1 ? 's' : ''}</p>
                    </div>
                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => { setEditingId(cat.id); setShowCreate(false) }}
                        className="px-3 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(cat.id)}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 animate-fade-in" onClick={() => setConfirmDeleteId(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm animate-scale-in">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-center font-bold text-gray-900 mb-1">Delete Category?</h3>
              <p className="text-center text-sm text-gray-500 mb-6">
                <span className="font-semibold">"{confirmDelete.name}"</span> will be permanently removed.
                {confirmDelete.count > 0 && (
                  <span className="block mt-1 text-amber-600 font-medium">
                    {confirmDelete.count} product{confirmDelete.count !== 1 ? 's' : ''} use this category.
                  </span>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmDeleteId(null)}
                  className="flex-1 py-2.5 border border-gray-200 text-sm font-semibold text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteMutation.mutate(confirmDelete.id)}
                  disabled={deleteMutation.isPending}
                  className="flex-1 py-2.5 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
