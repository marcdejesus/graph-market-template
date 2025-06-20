'use client'

import React from 'react'
import type { Order } from '@/types/order'

interface OrderItemsDetailProps {
  order: Order
}

export function OrderItemsDetail({ order }: OrderItemsDetailProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
      
      <div className="space-y-4">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
            <img
              src={item.image}
              alt={item.name}
              className="h-16 w-16 object-cover rounded-md"
            />
            
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </h4>
              
              {item.variant && (
                <div className="text-sm text-gray-600 mt-1">
                  {item.variant.size && <span>Size: {item.variant.size}</span>}
                  {item.variant.size && item.variant.color && <span> • </span>}
                  {item.variant.color && <span>Color: {item.variant.color}</span>}
                </div>
              )}
              
              <p className="text-sm text-gray-600 mt-1">
                Quantity: {item.quantity}
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(item.totalPrice)}
              </p>
              <p className="text-xs text-gray-600">
                {formatCurrency(item.unitPrice)} each
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
