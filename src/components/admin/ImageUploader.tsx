import { useRef, useState } from 'react'
import { api } from '../../lib/api'
import { toast } from '../common/Toast'

interface Props {
  images: string[]
  onChange: (images: string[]) => void
}

interface UploadingFile {
  id: string
  name: string
  originalSize: number
  compressedSize?: number
  state: 'compressing' | 'uploading' | 'done' | 'error'
  progress?: number
}

/** Compress and resize an image to a max dimension using Canvas API */
function compressImage(file: File, maxPx = 1400, quality = 0.82): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      const { width, height } = img

      // Calculate new dimensions keeping aspect ratio
      let newW = width
      let newH = height
      if (width > maxPx || height > maxPx) {
        if (width > height) {
          newW = maxPx
          newH = Math.round((height / width) * maxPx)
        } else {
          newH = maxPx
          newW = Math.round((width / height) * maxPx)
        }
      }

      const canvas = document.createElement('canvas')
      canvas.width = newW
      canvas.height = newH
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, newW, newH)

      canvas.toBlob(
        (blob) => {
          if (!blob) { reject(new Error('Compression failed')); return }
          // If compressed is bigger than original (rare for small files), use original
          const result = blob.size < file.size
            ? new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' })
            : file
          resolve(result)
        },
        'image/jpeg',
        quality,
      )
    }

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')) }
    img.src = url
  })
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}

export function ImageUploader({ images, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [queue, setQueue] = useState<UploadingFile[]>([])

  const uploadFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (!arr.length) return

    const batch: UploadingFile[] = arr.map(f => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      originalSize: f.size,
      state: 'compressing',
    }))
    setQueue(batch)

    // Step 1: compress all files in parallel
    const compressed = await Promise.all(
      arr.map(async (f, i) => {
        try {
          const result = await compressImage(f)
          setQueue(prev => prev.map((item, idx) =>
            idx === i ? { ...item, compressedSize: result.size, state: 'uploading' } : item
          ))
          return result
        } catch {
          setQueue(prev => prev.map((item, idx) =>
            idx === i ? { ...item, state: 'error' } : item
          ))
          return null
        }
      })
    )

    // Step 2: upload compressed files in parallel
    const results = await Promise.allSettled(
      compressed.map((f, i) => {
        if (!f) return Promise.reject(new Error('Compression failed'))
        return api.uploadProductImage(f).then(url => {
          setQueue(prev => prev.map((item, idx) =>
            idx === i ? { ...item, state: 'done' } : item
          ))
          return url
        })
      })
    )

    const newUrls: string[] = []
    results.forEach((r, i) => {
      if (r.status === 'fulfilled') {
        newUrls.push(r.value)
      } else {
        toast.error(`Failed to upload: ${arr[i].name}`)
        setQueue(prev => prev.map((item, idx) =>
          idx === i ? { ...item, state: 'error' } : item
        ))
      }
    })

    if (newUrls.length) onChange([...images, ...newUrls])
    setTimeout(() => setQueue([]), 2500)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    uploadFiles(e.dataTransfer.files)
  }

  const remove = (idx: number) => onChange(images.filter((_, i) => i !== idx))

  const setPrimary = (idx: number) => {
    if (idx === 0) return
    const next = [...images]
    const [moved] = next.splice(idx, 1)
    next.unshift(moved)
    onChange(next)
  }

  const isUploading = queue.some(q => q.state === 'compressing' || q.state === 'uploading')
  const allDone = queue.length > 0 && queue.every(q => q.state === 'done')

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
        className={`relative border-2 border-dashed transition-all cursor-pointer rounded-xl ${
          dragging
            ? 'border-black bg-black/5 scale-[1.01]'
            : isUploading
            ? 'border-gray-200 cursor-not-allowed bg-gray-50'
            : 'border-gray-200 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={e => e.target.files && uploadFiles(e.target.files)}
        />

        <div className="py-10 px-6 flex flex-col items-center gap-3">
          {isUploading ? (
            <>
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 border-2 border-gray-200 rounded-full" />
                <div className="absolute inset-0 border-2 border-black border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">
                  {queue.some(q => q.state === 'compressing') ? 'Compressing...' : 'Uploading...'}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Please wait</p>
              </div>
            </>
          ) : allDone ? (
            <>
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-medium text-emerald-700">Upload complete!</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700">Drop images here</p>
                <p className="text-xs text-gray-400 mt-1">
                  or <span className="text-black font-semibold underline underline-offset-2">browse files</span> · JPG, PNG, WEBP
                </p>
                <p className="text-[10px] text-gray-300 mt-1 uppercase tracking-widest">
                  Auto-compressed before upload
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Upload queue */}
      {queue.length > 0 && (
        <div className="space-y-1.5">
          {queue.map(f => {
            const savedPct = f.compressedSize && f.originalSize
              ? Math.round((1 - f.compressedSize / f.originalSize) * 100)
              : null
            return (
              <div key={f.id} className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-100">
                {/* State icon */}
                <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                  f.state === 'compressing' ? 'bg-amber-400 animate-pulse' :
                  f.state === 'uploading' ? 'bg-blue-400 animate-pulse' :
                  f.state === 'done' ? 'bg-emerald-500' : 'bg-red-500'
                }`} />

                {/* File name */}
                <span className="text-xs text-gray-600 truncate flex-1">{f.name}</span>

                {/* Size info */}
                <div className="flex items-center gap-2 flex-shrink-0 text-[10px] text-gray-400">
                  <span>{formatBytes(f.originalSize)}</span>
                  {savedPct !== null && savedPct > 0 && (
                    <span className="text-emerald-600 font-semibold">−{savedPct}%</span>
                  )}
                </div>

                {/* Status label */}
                <span className={`text-xs font-semibold flex-shrink-0 min-w-[60px] text-right ${
                  f.state === 'done' ? 'text-emerald-600' :
                  f.state === 'error' ? 'text-red-500' :
                  f.state === 'compressing' ? 'text-amber-600' : 'text-blue-500'
                }`}>
                  {f.state === 'compressing' ? 'Compressing' :
                   f.state === 'uploading' ? 'Uploading' :
                   f.state === 'done' ? '✓ Done' : '✕ Failed'}
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Image gallery */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-widest text-gray-400">
              {images.length} image{images.length !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-gray-400">Click image to set as primary</p>
          </div>

          {/* Primary image */}
          <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden group rounded-lg">
            <img src={images[0]} alt="Primary" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
              Primary
            </span>
            <button
              type="button"
              onClick={() => remove(0)}
              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-1.5">
              {images.slice(1).map((url, i) => (
                <div key={url} className="relative group aspect-square bg-gray-100 overflow-hidden rounded-lg">
                  <img
                    src={url}
                    alt=""
                    onClick={() => setPrimary(i + 1)}
                    className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  <button
                    type="button"
                    onClick={() => remove(i + 1)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
              {/* Add more */}
              <div
                onClick={() => inputRef.current?.click()}
                className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 hover:border-gray-400 cursor-pointer flex items-center justify-center transition-colors rounded-lg"
              >
                <span className="text-gray-300 text-xl font-light">+</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
