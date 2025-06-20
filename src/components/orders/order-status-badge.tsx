import React from 'react'
import { Badge } from '@/components/ui/badge'
import type { OrderStatus } from '@/types/order'

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          variant: 'warning' as const,
          label: 'Pending',
          icon: '⏳'
        }
      case 'confirmed':
        return {
          variant: 'info' as const,
          label: 'Confirmed',
          icon: '✅'
        }
      case 'processing':
        return {
          variant: 'info' as const,
          label: 'Processing',
          icon: '⚙️'
        }
      case 'shipped':
        return {
          variant: 'success' as const,
          label: 'Shipped',
          icon: '🚚'
        }
      case 'delivered':
        return {
          variant: 'success' as const,
          label: 'Delivered',
          icon: '📦'
        }
      case 'cancelled':
        return {
          variant: 'error' as const,
          label: 'Cancelled',
          icon: '❌'
        }
      case 'refunded':
        return {
          variant: 'outline' as const,
          label: 'Refunded',
          icon: '💰'
        }
      default:
        return {
          variant: 'default' as const,
          label: 'Unknown',
          icon: '❓'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <Badge variant={config.variant} className={className}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </Badge>
  )
} 