import type { Order } from '../../lib/api'

interface Config {
  bg: string
  text: string
  dot: string
  label: string
}

const STATUS_CONFIG: Record<Order['status'], Config> = {
  pending:    { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B', label: 'Pending' },
  processing: { bg: '#DBEAFE', text: '#1E40AF', dot: '#3B82F6', label: 'Processing' },
  shipped:    { bg: '#EDE9FE', text: '#5B21B6', dot: '#7C3AED', label: 'Shipped' },
  delivered:  { bg: '#D1FAE5', text: '#065F46', dot: '#10B981', label: 'Delivered' },
}

interface Props {
  status: Order['status']
  size?: 'sm' | 'md' | 'lg'
}

export function StatusBadge({ status, size = 'md' }: Props) {
  const c = STATUS_CONFIG[status]
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size]

  const dotSize = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }[size]

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full whitespace-nowrap ${sizeClasses}`}
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <span className={`${dotSize} rounded-full flex-shrink-0`} style={{ backgroundColor: c.dot }} />
      {c.label}
    </span>
  )
}
