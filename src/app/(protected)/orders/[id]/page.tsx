'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { MainLayout } from '@/components/layout'
import { OrderDetail } from '@/components/orders'
import { LoadingSpinner } from '@/components/ui/loading'
import { useOrder } from '@/hooks/useOrders'
import { useCartContext } from '@/context/cart-context'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCartContext()
  const orderId = params.id as string

  const { order, isLoading, error } = useOrder(orderId)

  const handleReorder = async (orderIdToReorder: string) => {
    try {
      // Mock reorder functionality - in real app, this would call an API
      console.log('Reordering items from order:', orderIdToReorder)
      
      if (order) {
        // Add all items from the order to cart
        for (const item of order.items) {
          await addToCart({
            productId: item.productId,
            name: item.name,
            price: item.unitPrice,
            imageUrl: item.image,
            size: item.variant?.size,
            color: item.variant?.color,
            maxQuantity: 10, // Default max quantity
            quantity: item.quantity
          })
        }
        
        // Navigate to cart
        router.push('/cart')
      }
    } catch (error) {
      console.error('Failed to reorder:', error)
    }
  }

  const handleCancelOrder = async (orderIdToCancel: string, reason?: string) => {
    try {
      // Mock cancel functionality - in real app, this would call an API
      console.log('Cancelling order:', orderIdToCancel, 'Reason:', reason)
      
      // Refresh order data after cancellation
      window.location.reload()
    } catch (error) {
      console.error('Failed to cancel order:', error)
    }
  }

  const handleReturnOrder = async (orderIdToReturn: string, reason?: string) => {
    try {
      // Mock return functionality - in real app, this would call an API
      console.log('Returning order:', orderIdToReturn, 'Reason:', reason)
      
      // Refresh order data after return request
      window.location.reload()
    } catch (error) {
      console.error('Failed to return order:', error)
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <LoadingSpinner size="lg" />
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  if (error || !order) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
              <p className="text-gray-600 mb-4">
                The order you're looking for doesn't exist or you don't have permission to view it.
              </p>
              <button
                onClick={() => router.push('/orders')}
                className="text-blue-600 hover:text-blue-800"
              >
                Back to Orders
              </button>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <OrderDetail
          order={order}
          onReorder={handleReorder}
          onCancelOrder={handleCancelOrder}
          onReturnOrder={handleReturnOrder}
        />
      </MainLayout>
    </ProtectedRoute>
  )
}
