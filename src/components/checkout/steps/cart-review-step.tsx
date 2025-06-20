'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCheckout } from '@/context/checkout-context'
import { useCartContext } from '@/context/cart-context'
import { Button } from '@/components/ui/button'
import { CartItemCard } from '@/components/cart/cart-item-card'
import { EmptyCartState } from '@/components/cart/empty-cart-state'
import { Badge } from '@/components/ui/badge'
import { ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react'

export function CartReviewStep() {
  const router = useRouter()
  const { completeStep, goToNextStep } = useCheckout()
  const { state: cartState } = useCartContext()
  const [isValidating, setIsValidating] = useState(false)

  const handleContinueToShipping = async () => {
    setIsValidating(true)
    
    try {
      // Validate cart has items
      if (cartState.items.length === 0) {
        setIsValidating(false)
        return
      }

      // Simulate cart validation (stock check, price verification, etc.)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mark step as complete and proceed
      completeStep('cart')
      goToNextStep()
    } catch (error) {
      console.error('Cart validation failed:', error)
    } finally {
      setIsValidating(false)
    }
  }

  const handleContinueShopping = () => {
    router.push('/products')
  }

  // Show empty cart state if no items
  if (cartState.items.length === 0) {
    return (
      <div className="space-y-6">
        <EmptyCartState onContinueShopping={handleContinueShopping} />
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Add items to your cart before proceeding to checkout
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Cart Items Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Review Your Items ({cartState.items.length})
        </h3>
        <Badge variant="default" className="bg-green-100 text-green-800">
          <ShoppingBag className="w-3 h-3 mr-1" />
          In Stock
        </Badge>
      </div>

      {/* Cart Items List */}
      <div className="space-y-4">
        {cartState.items.map((item) => (
          <CartItemCard key={`${item.productId}-${item.variantId || 'default'}`} item={item} />
        ))}
      </div>

      {/* Order Summary Preview */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h4 className="font-medium text-gray-900">Order Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal ({cartState.totalItems} items)</span>
            <span>${cartState.totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Estimated Tax</span>
            <span>${(cartState.totalAmount * 0.0875).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{cartState.totalAmount >= 75 ? 'FREE' : '$8.99'}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-medium">
            <span>Estimated Total</span>
            <span>
              ${(cartState.totalAmount + (cartState.totalAmount * 0.0875) + (cartState.totalAmount >= 75 ? 0 : 8.99)).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Free Shipping Progress */}
        {cartState.totalAmount < 75 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <div className="flex items-center text-blue-700 text-sm">
              <Truck className="w-4 h-4 mr-2" />
              Add ${(75 - cartState.totalAmount).toFixed(2)} more for FREE shipping
            </div>
            <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((cartState.totalAmount / 75) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Trust Signals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
        <div className="flex items-center text-sm text-gray-600">
          <Shield className="w-4 h-4 mr-2 text-green-500" />
          Secure Checkout
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <RotateCcw className="w-4 h-4 mr-2 text-green-500" />
          Easy Returns
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Truck className="w-4 h-4 mr-2 text-green-500" />
          Fast Delivery
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleContinueToShipping}
          disabled={isValidating || cartState.items.length === 0}
          className="bg-[#e53e3e] hover:bg-[#c53030] text-white px-8 py-3 text-base"
        >
          {isValidating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Validating Cart...
            </>
          ) : (
            'Continue to Shipping'
          )}
        </Button>
      </div>

      {/* Additional Info */}
      <div className="text-center text-sm text-gray-500">
        <p>Need to modify your cart? You can update quantities above or continue shopping.</p>
      </div>
    </div>
  )
} 