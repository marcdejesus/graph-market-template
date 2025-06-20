'use client'
'use client'

'use client'

import React, { useState, useCallback } from 'react'
import { useOrders } from '@/hooks/useOrders'
import { useCart } from '@/hooks/useCart'
import { OrderCard } from './order-card'
import { OrderFilters } from './order-filters'
import { OrderPagination } from './order-pagination'
import { LoadingSpinner } from '@/components/ui/loading'
import type { OrderFilters as OrderFiltersType } from '@/types/order'
import { Package, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function OrderList() {
  const router = useRouter()
  const { addToCart } = useCart()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<OrderFiltersType>({})
  
  const itemsPerPage = 10
  const offset = (currentPage - 1) * itemsPerPage

  const {
    orders,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    isLoading,
    error,
    fetchOrders
  } = useOrders({
    limit: itemsPerPage,
    offset,
    filters: {
      ...filters,
      search: searchQuery
    },
    autoFetch: true
  })

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleFiltersChange = useCallback((newFilters: OrderFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }, [])

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }, [])

  const handleReorder = useCallback(async (orderId: string) => {
    try {
      const order = orders.find(o => o.id === orderId)
      if (!order) return

      for (const item of order.items) {
        await addToCart({
          productId: item.productId,
          name: item.name,
          price: item.unitPrice,
          imageUrl: item.image,
          maxQuantity: 99,
          quantity: item.quantity
        })
      }

      router.push('/cart')
    } catch (error) {
      console.error('Failed to reorder:', error)
    }
  }, [orders, addToCart, router])

  const handleTrackOrder = useCallback((orderId: string) => {
    router.push(`/orders/${orderId}` as any)
  }, [router])

  if (isLoading && currentPage === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <Package className="h-12 w-12 mx-auto mb-2" />
          <p className="text-lg font-medium">Failed to load orders</p>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
        </div>
        <Button onClick={() => fetchOrders()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  const hasOrders = orders.length > 0
  const totalPages = Math.ceil(totalCount / itemsPerPage)

  return (
    <div className="space-y-6">
      <OrderFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onSearch={handleSearch}
        totalCount={totalCount}
      />

      {hasOrders ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onReorder={handleReorder}
              onTrackOrder={handleTrackOrder}
            />
          ))}
        </div>
      ) : (
        <EmptyOrderState 
          hasFilters={!!(searchQuery || filters.status?.length || filters.dateFrom)}
          onClearFilters={() => {
            setSearchQuery('')
            setFilters({})
          }}
        />
      )}

      {hasOrders && totalPages > 1 && (
        <OrderPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={itemsPerPage}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onPageChange={handlePageChange}
        />
      )}

      {isLoading && currentPage > 1 && (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      )}
    </div>
  )
}

interface EmptyOrderStateProps {
  hasFilters: boolean
  onClearFilters: () => void
}

function EmptyOrderState({ hasFilters, onClearFilters }: EmptyOrderStateProps) {
  const router = useRouter()

  return (
    <div className="text-center py-12">
      <div className="max-w-md mx-auto">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        
        {hasFilters ? (
          <>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn&apos;t find any orders matching your current filters. 
              Try adjusting your search criteria.
            </p>
            <div className="space-x-3">
              <Button
                variant="outline"
                onClick={onClearFilters}
              >
                Clear Filters
              </Button>
              <Button
                variant="performance"
                onClick={() => router.push('/products')}
              >
                Continue Shopping
              </Button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven&apos;t placed any orders yet. Start shopping to see your order history here.
            </p>
            <Button
              variant="performance"
              onClick={() => router.push('/products')}
            >
              Start Shopping
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
