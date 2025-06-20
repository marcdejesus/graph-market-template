'use client'

import React from 'react'
import type { Order } from '@/types/order'

interface OrderSummaryProps {
  order: Order
}

export function OrderSummary({ order }: OrderSummaryProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">
            {order.shippingCost === 0 ? 'Free' : formatCurrency(order.shippingCost)}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="text-gray-900">{formatCurrency(order.tax)}</span>
        </div>
        
        {order.discount && order.discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount</span>
            <span className="text-green-600">-{formatCurrency(order.discount)}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-base font-medium">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Addresses</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
              Shipping Address
            </h5>
            <div className="text-sm text-gray-900">
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.address1}</p>
              {order.shippingAddress.address2 && (
                <p>{order.shippingAddress.address2}</p>
              )}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
          
          <div>
            <h5 className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">
              Billing Address
            </h5>
            <div className="text-sm text-gray-900">
              <p>{order.billingAddress.name}</p>
              <p>{order.billingAddress.address1}</p>
              {order.billingAddress.address2 && (
                <p>{order.billingAddress.address2}</p>
              )}
              <p>
                {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zipCode}
              </p>
              <p>{order.billingAddress.country}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Payment Method</h4>
        <div className="text-sm text-gray-900">
          <p>**** **** **** 4242</p>
          <p className="text-gray-600">Visa ending in 4242</p>
        </div>
      </div>
    </div>
  )
}
