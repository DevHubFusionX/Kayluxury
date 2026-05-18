import { useState, useEffect } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { api, type Product, type Category } from '../../lib/api'
import { toast } from '../common/Toast'
import { ImageUploader } from './ImageUploader'
import { SizeSelector } from './SizeSelector'
import { ColorPicker } from './ColorPicker'

const EMPTY = {
  name: '',
  price: '',
  category: '',
  description: '',
  details: '',
  inStock: true,
}

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span
          className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0 text-black"
          style={{ backgroundColor: '#C9A84C' }}
        >
          {step}
        </span>
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-700">{title}</h3>
        <div className="flex-1 h-px bg-gray-100" />
      </div>
      <div className="pl-9">{children}</div>
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 px-3.5 py-3 text-sm focus:outline-none focus:border-black transition-colors bg-white placeholder:text-gray-300 rounded-lg'
const labelCls = 'block text-[11px] uppercase tracking-widest text-gray-400 mb-1.5 font-medium'

interface Props {
  /** If provided, the form runs in edit mode */
  editProduct?: Product
  onSuccess?: () => void
}

export function ProductForm({ editProduct, onSuccess }: Props) {
  const queryClient = useQueryClient()

  const { data: categoryDocs = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  })
  const categoryNames = categoryDocs.map(c => c.name)

  const [form, setForm] = useState({
    ...EMPTY,
    ...(editProduct ? {
      name: editProduct.name,
      price: String(editProduct.price),
      category: editProduct.category,
      description: editProduct.description,
      details: editProduct.details.join('\n'),
      inStock: editProduct.inStock,
    } : { category: categoryNames[0] ?? '' }),
  })
  const [sizes, setSizes] = useState<string[]>(editProduct?.sizes ?? ['S', 'M', 'L', 'XL'])
  const [colors, setColors] = useState<Product['colors']>(editProduct?.colors ?? [{ name: 'Black', hex: '#000000' }])
  const [images, setImages] = useState<string[]>(editProduct?.images ?? [])
  const [error, setError] = useState<string | null>(null)

  // Sync when editProduct changes (e.g. clicking a different product to edit)
  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        price: String(editProduct.price),
        category: editProduct.category,
        description: editProduct.description,
        details: editProduct.details.join('\n'),
        inStock: editProduct.inStock,
      })
      setSizes(editProduct.sizes)
      setColors(editProduct.colors)
      setImages(editProduct.images)
      setError(null)
    }
  }, [editProduct?.id])

  const isEdit = !!editProduct

  const createProduct = useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products-admin'] })
      toast.success('Product created!')
      resetForm()
      onSuccess?.()
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : 'Failed to create product'
      setError(msg)
      toast.error(msg)
    },
  })

  const updateProduct = useMutation({
    mutationFn: (data: Partial<Omit<Product, 'id'>>) => api.updateProduct(editProduct!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products-admin'] })
      toast.success('Product updated!')
      onSuccess?.()
    },
    onError: (err) => {
      const msg = err instanceof Error ? err.message : 'Failed to update product'
      setError(msg)
      toast.error(msg)
    },
  })

  const isPending = createProduct.isPending || updateProduct.isPending

  const resetForm = () => {
    setForm(EMPTY)
    setSizes(['S', 'M', 'L', 'XL'])
    setColors([{ name: 'Black', hex: '#000000' }])
    setImages([])
    setError(null)
  }

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.name.trim())                   { setError('Product name is required'); return }
    if (!form.price || Number(form.price) <= 0) { setError('Enter a valid price'); return }
    if (images.length === 0)                 { setError('Upload at least one image'); return }
    if (sizes.length === 0)                  { setError('Select at least one size'); return }
    if (colors.length === 0)                 { setError('Add at least one color'); return }

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category,
      images,
      sizes,
      colors,
      description: form.description.trim(),
      details: form.details.split('\n').map(d => d.trim()).filter(Boolean),
      inStock: form.inStock,
    }

    if (isEdit) {
      updateProduct.mutate(payload)
    } else {
      createProduct.mutate(payload)
    }
  }

  const priceNum = Number(form.price)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Edit mode banner */}
      {isEdit && (
        <div className="flex items-center gap-3 p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span className="uppercase tracking-widest font-semibold">Editing: {editProduct.name}</span>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="uppercase tracking-widest">{error}</span>
        </div>
      )}

      {/* 1 — Basic Info */}
      <Section step={1} title="Basic Info">
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Product Name *</label>
            <input
              type="text" name="name" value={form.name} onChange={set}
              className={inputCls} placeholder="e.g. Classic Linen Overshirt"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Price (₦) *</label>
              <input
                type="number" name="price" value={form.price} onChange={set}
                min="0" className={inputCls} placeholder="25000"
              />
              {priceNum > 0 && (
                <p className="mt-1 text-xs text-gray-400">
                  ₦{priceNum.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>
            <div>
              <label className={labelCls}>Category</label>
              <select name="category" value={form.category} onChange={set} className={inputCls}>
                {categoryNames.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea
              name="description" value={form.description} onChange={set}
              rows={3} className={`${inputCls} resize-none`}
              placeholder="Describe the product — fabric, fit, occasion..."
            />
          </div>
        </div>
      </Section>

      {/* 2 — Images */}
      <Section step={2} title="Product Images">
        <ImageUploader images={images} onChange={setImages} />
      </Section>

      {/* 3 — Variants */}
      <Section step={3} title="Sizes">
        <SizeSelector sizes={sizes} onChange={setSizes} />
      </Section>

      <Section step={4} title="Colors">
        <ColorPicker colors={colors} onChange={setColors} />
      </Section>

      {/* 5 — Details */}
      <Section step={5} title="Product Details">
        <div>
          <label className={labelCls}>
            Bullet points <span className="normal-case text-gray-300">— one per line</span>
          </label>
          <textarea
            name="details" value={form.details} onChange={set}
            rows={4} className={`${inputCls} resize-none`}
            placeholder={"100% Premium Cotton\nMachine washable at 30°C\nSlim fit — true to size\nMade in Nigeria"}
          />
        </div>
      </Section>

      {/* 6 — Publish */}
      <Section step={6} title={isEdit ? 'Save Changes' : 'Publish'}>
        <div className="space-y-4">
          {/* Stock toggle */}
          <div
            onClick={() => setForm(p => ({ ...p, inStock: !p.inStock }))}
            className="flex items-center justify-between p-4 border border-gray-200 cursor-pointer hover:border-gray-400 transition-colors select-none rounded-lg"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">Availability</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {form.inStock ? 'Visible and purchasable in store' : 'Hidden from store — out of stock'}
              </p>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${form.inStock ? 'bg-black' : 'bg-gray-200'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.inStock ? 'translate-x-6' : 'translate-x-1'}`} />
            </div>
          </div>

          {/* Preview summary */}
          {(form.name || priceNum > 0 || images.length > 0) && (
            <div className="p-4 bg-gray-50 border border-gray-100 space-y-2 rounded-lg">
              <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Preview</p>
              <div className="flex gap-3">
                {images[0] && (
                  <img src={images[0]} alt="" className="w-14 h-16 object-cover flex-shrink-0 bg-gray-200 rounded" />
                )}
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">{form.name || '—'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{form.category}</p>
                  {priceNum > 0 && <p className="text-sm font-bold mt-1">₦{priceNum.toLocaleString()}</p>}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {sizes.slice(0, 5).map(s => (
                      <span key={s} className="text-[10px] border border-gray-200 px-1.5 py-0.5 text-gray-500 rounded">{s}</span>
                    ))}
                    {colors.slice(0, 4).map(c => (
                      <span key={c.hex} className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: c.hex }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full text-black py-4 font-bold uppercase tracking-widest text-sm disabled:opacity-50 transition-all flex items-center justify-center gap-2 rounded-lg"
            style={{ backgroundColor: '#C9A84C' }}
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                {isEdit ? 'Saving...' : 'Creating...'}
              </>
            ) : (
              isEdit ? 'Save Changes' : 'Create Product'
            )}
          </button>

          {!isEdit && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full py-2.5 text-xs text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
            >
              Clear form
            </button>
          )}
        </div>
      </Section>
    </form>
  )
}
