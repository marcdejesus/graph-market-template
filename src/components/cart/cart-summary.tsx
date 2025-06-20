'use client'

import { useCartEnhanced } from '@/hooks/useCartEnhanced'
import { useCartContext } from '@/context/cart-context'
import { Badge } from '@/components/ui/badge'

export function CartSummary() {
  const { state } = useCartContext()
  const { 
    cartSummary,
    getTotalUniqueItems,
    getCartWeight,
    getEstimatedDelivery
  } = useCartEnhanced()

  if (state.items.length === 0) {
    return null
  }

  const estimatedDelivery = getEstimatedDelivery()
  const freeShippingThreshold = 75

  return (
    <div className="space-y-4">
      {/* Cart Statistics */}
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge variant="default" className="bg-gray-100 text-gray-600">
          {getTotalUniqueItems()} unique items
        </Badge>
        <Badge variant="default" className="bg-gray-100 text-gray-600">
          {getCartWeight().toFixed(1)} lbs
        </Badge>
        <Badge variant="default" className="bg-gray-100 text-gray-600">
          Est. delivery: {estimatedDelivery.toLocaleDateString()}
        </Badge>
      </div>

      {/* Summary Breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            ${cartSummary.subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium text-gray-900">
            ${cartSummary.tax.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Shipping</span>
            {cartSummary.shipping === 0 && (
              <Badge variant="success" className="text-xs">
                FREE
              </Badge>
            )}
          </div>
          <span className="font-medium text-gray-900">
            ${cartSummary.shipping.toFixed(2)}
          </span>
        </div>

        {/* Free Shipping Progress */}
        {cartSummary.subtotal < freeShippingThreshold && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-blue-800">
                Free shipping progress
              </span>
              <span className="text-xs text-blue-600">
                ${(freeShippingThreshold - cartSummary.subtotal).toFixed(2)} to go
              </span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((cartSummary.subtotal / freeShippingThreshold) * 100, 100)}%` 
                }}
              />
            </div>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-base font-bold text-gray-900">
              ${cartSummary.total.toFixed(2)}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Including ${cartSummary.tax.toFixed(2)} in taxes
          </p>
        </div>

        {/* Savings Summary */}
        {cartSummary.shipping === 0 && cartSummary.subtotal >= freeShippingThreshold && (
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-800">
                You saved
              </span>
              <span className="text-sm font-bold text-green-800">
                $8.99
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              From free shipping
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 