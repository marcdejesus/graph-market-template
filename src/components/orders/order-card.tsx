'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  Card, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OrderStatusBadge } from './order-status-badge'
import type { Order } from '@/types/order'
import { Package, Calendar, DollarSign, Eye, RotateCcw, Truck } from 'lucide-react'

interface OrderCardProps {
  order: Order
  onReorder?: (_orderId: string) => void
  onTrackOrder?: (_orderId: string) => void
}

export function OrderCard({ order, onReorder, onTrackOrder }: OrderCardProps) {
  const router = useRouter()
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getItemsPreview = () => {
    const totalItems = order.items.length
    const firstThreeItems = order.items.slice(0, 3)
    
    return {
      items: firstThreeItems,
      hasMore: totalItems > 3,
      additionalCount: totalItems - 3
    }
  }

  const itemsPreview = getItemsPreview()
  const canReorder = ['delivered', 'cancelled'].includes(order.status)
  const canTrack = ['confirmed', 'processing', 'shipped'].includes(order.status)

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Header with Order Number and Status */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.orderNumber}
            </h3>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              {formatDate(order.createdAt)}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Items Preview */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-2">
              <Package className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">
                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {itemsPreview.items.map((item, index) => (
                <div key={item.id} className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 object-cover rounded-md border border-gray-200"
                  />
                  {index < itemsPreview.items.length - 1 && (
                    <span className="mx-2 text-gray-300">•</span>
                  )}
                </div>
              ))}
              {itemsPreview.hasMore && (
                <div className="flex items-center justify-center h-12 w-12 bg-gray-100 rounded-md border border-gray-200">
                  <span className="text-xs text-gray-600 font-medium">
                    +{itemsPreview.additionalCount}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Order Total */}
          <div className="text-right">
            <div className="flex items-center justify-end mb-1">
              <DollarSign className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-600">Total</span>
            </div>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>

        {/* Shipping Address Preview */}
        <div className="text-sm text-gray-600">
          <span className="font-medium">Ship to:</span> {order.shippingAddress.firstName} {order.shippingAddress.lastName}, {order.shippingAddress.city}, {order.shippingAddress.province}
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between w-full">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push(`/orders/${order.id}` as any)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Button>
            
            {canTrack && onTrackOrder && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onTrackOrder(order.id)}
              >
                <Truck className="h-4 w-4 mr-1" />
                Track Order
              </Button>
            )}
          </div>

          {canReorder && onReorder && (
            <Button 
              variant="performance" 
              size="sm"
              onClick={() => onReorder(order.id)}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reorder
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
