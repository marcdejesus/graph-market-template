'use client'

import React from 'react'
import { OrderStatusBadge } from './order-status-badge'
import type { Order, OrderStatus } from '@/types/order'
import { Check, Circle, Package, Truck, MapPin } from 'lucide-react'

interface OrderTrackingProps {
  order: Order
}

interface TrackingStep {
  status: OrderStatus
  label: string
  icon: React.ReactNode
  description: string
}

export function OrderTracking({ order }: OrderTrackingProps) {
  const trackingSteps: TrackingStep[] = [
    {
      status: 'pending',
      label: 'Order Placed',
      icon: <Circle className="h-5 w-5" />,
      description: 'Your order has been received'
    },
    {
      status: 'confirmed',
      label: 'Order Confirmed',
      icon: <Check className="h-5 w-5" />,
      description: 'Payment confirmed and order processing'
    },
    {
      status: 'processing',
      label: 'Processing',
      icon: <Package className="h-5 w-5" />,
      description: 'Your items are being prepared'
    },
    {
      status: 'shipped',
      label: 'Shipped',
      icon: <Truck className="h-5 w-5" />,
      description: 'Your order is on its way'
    },
    {
      status: 'delivered',
      label: 'Delivered',
      icon: <MapPin className="h-5 w-5" />,
      description: 'Order delivered successfully'
    }
  ]

  const getStatusIndex = (status: OrderStatus): number => {
    const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
    return statusOrder.indexOf(status)
  }

  const currentStatusIndex = getStatusIndex(order.status)
  const isOrderCancelled = order.status === 'cancelled'
  const isOrderRefunded = order.status === 'refunded'

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isOrderCancelled || isOrderRefunded) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Order Status</h3>
          <OrderStatusBadge status={order.status} />
        </div>
        
        <div className="text-center py-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="h-8 w-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            Order {order.status === 'cancelled' ? 'Cancelled' : 'Refunded'}
          </h4>
          <p className="text-gray-600">
            {order.status === 'cancelled' 
              ? 'This order was cancelled and no charges were made.'
              : 'This order has been refunded to your original payment method.'
            }
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {order.status === 'cancelled' ? 'Cancelled' : 'Refunded'} on {formatDate(order.updatedAt)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Order Tracking</h3>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Tracking Number */}
      {order.trackingNumber && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-900">Tracking Number</p>
              <p className="text-blue-700 font-mono">{order.trackingNumber}</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Track Package
            </button>
          </div>
        </div>
      )}

      {/* Estimated Delivery */}
      {order.estimatedDelivery && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <p className="text-sm font-medium text-green-900">Estimated Delivery</p>
          <p className="text-green-700">{formatDate(order.estimatedDelivery)}</p>
        </div>
      )}

      {/* Tracking Timeline */}
      <div className="relative">
        {trackingSteps.map((step, index) => {
          const isCompleted = index <= currentStatusIndex
          const isCurrent = index === currentStatusIndex
          const isLast = index === trackingSteps.length - 1

          return (
            <div key={step.status} className="relative">
              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`absolute left-6 top-12 h-12 w-0.5 ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}

              {/* Step Content */}
              <div className="flex items-start">
                {/* Step Icon */}
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : isCurrent
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                  }`}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : step.icon}
                </div>

                {/* Step Details */}
                <div className="ml-4 min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-sm font-medium ${
                        isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </h4>
                    {isCompleted && (
                      <span className="text-xs text-gray-500">
                        {index === 0 ? formatDate(order.createdAt) : ''}
                        {index === currentStatusIndex ? formatDate(order.updatedAt) : ''}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Spacing */}
              {!isLast && <div className="h-8" />}
            </div>
          )
        })}
      </div>
    </div>
  )
} 