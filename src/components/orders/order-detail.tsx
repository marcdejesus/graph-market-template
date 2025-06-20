'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { OrderTracking } from './order-tracking'
import { OrderActions } from './order-actions'
import { OrderItemsDetail } from './order-items-detail'
import { OrderSummary } from './order-summary'
import type { Order } from '@/types/order'
import { ArrowLeft } from 'lucide-react'

interface OrderDetailProps {
  order: Order
  onReorder?: (_orderId: string) => void
  onCancelOrder?: (_orderId: string, _reason?: string) => void
  onReturnOrder?: (_orderId: string, _reason?: string) => void
}

export function OrderDetail({
  order,
  onReorder,
  onCancelOrder,
  onReturnOrder
}: OrderDetailProps) {
  const router = useRouter()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/orders')}
            className="mb-4 p-0 h-auto text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-athletic-black">
                Order #{order.orderNumber}
              </h1>
              <p className="text-steel-gray mt-2">
                Placed on {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <OrderTracking order={order} />
            <OrderItemsDetail order={order} />
            <OrderActions
              order={order}
              onReorder={onReorder}
              onCancelOrder={onCancelOrder}
              onReturnOrder={onReturnOrder}
            />
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary order={order} />
          </div>
        </div>
      </div>
    </div>
  )
}
