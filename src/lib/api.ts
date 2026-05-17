import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type QueryConstraint,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '../firebase'

export interface Product {
  id: string
  name: string
  price: number
  category: string
  images: string[]
  sizes: string[]
  colors: { name: string; hex: string }[]
  description: string
  details: string[]
  inStock: boolean
}

export interface Category {
  name: string
  image: string
  count: number
}

export interface ProductsResponse {
  total: number
  page: number
  limit: number
  data: Product[]
}

export interface OrderItem {
  id: string
  name: string
  size: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  name: string
  email: string
  phone: string
  address: string
  items: OrderItem[]
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  createdAt: string
}

export interface OrderPayload {
  name: string
  email: string
  phone: string
  address: string
  items: OrderItem[]
  total: number
}

const productsCollection = collection(db, 'products')
const categoriesCollection = collection(db, 'categories')
const ordersCollection = collection(db, 'orders')

function mapProduct(docId: string, data: Record<string, unknown>): Product {
  return {
    id: docId,
    name: String(data.name ?? ''),
    price: Number(data.price ?? 0),
    category: String(data.category ?? ''),
    images: Array.isArray(data.images) ? (data.images as string[]) : [],
    sizes: Array.isArray(data.sizes) ? (data.sizes as string[]) : [],
    colors: Array.isArray(data.colors) ? (data.colors as Product['colors']) : [],
    description: String(data.description ?? ''),
    details: Array.isArray(data.details) ? (data.details as string[]) : [],
    inStock: Boolean(data.inStock),
  }
}

function mapOrder(docId: string, data: Record<string, unknown>): Order {
  return {
    id: docId,
    name: String(data.name ?? ''),
    email: String(data.email ?? ''),
    phone: String(data.phone ?? ''),
    address: String(data.address ?? ''),
    items: Array.isArray(data.items) ? (data.items as OrderItem[]) : [],
    total: Number(data.total ?? 0),
    status: (data.status as Order['status']) ?? 'pending',
    createdAt: String(data.createdAt ?? new Date().toISOString()),
  }
}

export const api = {
  getProducts: async (params: Record<string, string | number> = {}): Promise<ProductsResponse> => {
    const page = Number(params.page || 1)
    const limit = Number(params.limit || 12)
    const constraints: QueryConstraint[] = []

    if (params.category) constraints.push(where('category', '==', String(params.category)))

    if (params.sort === 'price_asc') constraints.push(orderBy('price', 'asc'))
    else if (params.sort === 'price_desc') constraints.push(orderBy('price', 'desc'))
    else constraints.push(orderBy('name', 'asc'))

    const snapshot = await getDocs(query(productsCollection, ...constraints))
    const products = snapshot.docs.map((d) => mapProduct(d.id, d.data() as Record<string, unknown>))

    const total = products.length
    const start = (page - 1) * limit
    return { total, page, limit, data: products.slice(start, start + limit) }
  },

  getProduct: async (id: string): Promise<Product> => {
    const snap = await getDoc(doc(db, 'products', id))
    if (!snap.exists()) throw new Error('Product not found')
    return mapProduct(snap.id, snap.data() as Record<string, unknown>)
  },

  getCategories: async (): Promise<{ name: string; image: string; count: number }[]> => {
    const snapshot = await getDocs(categoriesCollection)
    return snapshot.docs.map((d) => {
      const data = d.data() as Record<string, unknown>
      return { name: String(data.name ?? ''), image: String(data.image ?? ''), count: Number(data.count ?? 0) }
    })
  },

  createOrder: async (payload: OrderPayload): Promise<{ message: string; orderId: string }> => {
    const docRef = await addDoc(ordersCollection, {
      ...payload,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      createdAtTimestamp: serverTimestamp(),
    })
    return { message: 'Order saved successfully', orderId: docRef.id }
  },

  getOrders: async (): Promise<Order[]> => {
    const snapshot = await getDocs(query(ordersCollection, orderBy('createdAt', 'desc')))
    return snapshot.docs.map((d) => mapOrder(d.id, d.data() as Record<string, unknown>))
  },

  subscribeToOrders: (
    callback: (orders: Order[]) => void,
    onError?: (err: Error) => void,
  ): Unsubscribe => {
    return onSnapshot(
      query(ordersCollection, orderBy('createdAt', 'desc')),
      (snapshot) => callback(snapshot.docs.map((d) => mapOrder(d.id, d.data() as Record<string, unknown>))),
      (err) => {
        console.warn('Orders subscription error:', err.message)
        onError?.(err)
      },
    )
  },

  updateOrderStatus: async (id: string, status: Order['status']): Promise<void> => {
    await updateDoc(doc(db, 'orders', id), { status })
  },

  uploadProductImage: async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    console.log('--- Cloudinary Upload Configuration ---')
    console.log('Cloud Name:', cloudName)
    console.log('Upload Preset:', uploadPreset)
    console.log('File Name:', file.name)
    console.log('----------------------------------------')

    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary environment variables (VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET) are missing in .env!')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error?.message || 'Failed to upload to Cloudinary')
    }

    const data = await res.json()
    return data.secure_url
  },


  createProduct: async (product: Omit<Product, 'id'>): Promise<string> => {
    const docRef = await addDoc(productsCollection, { ...product, createdAt: serverTimestamp() })
    return docRef.id
  },

  updateProduct: async (id: string, updates: Partial<Omit<Product, 'id'>>): Promise<void> => {
    await updateDoc(doc(db, 'products', id), updates)
  },

  deleteProduct: async (id: string): Promise<void> => {
    await deleteDoc(doc(db, 'products', id))
  },

  deleteProductImage: async (imageUrl: string): Promise<void> => {
    // Client-side deletes on Cloudinary require signed requests. 
    // Since this is a serverless frontend, we bypass this to prevent CORS/security blocks.
    console.log('Skipping image deletion from Cloudinary on client-side:', imageUrl)
  },
}


