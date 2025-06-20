'use client'

import { useState } from 'react'
import { useCheckout } from '@/context/checkout-context'
import { useCartContext } from '@/context/cart-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Package, 
  MapPin, 
  Truck, 
  CreditCard,
  Tag,
  Check,
  Loader2,
  Shield,
  AlertCircle
} from 'lucide-react'

export function ConfirmationStep() {
  const { state, placeOrder } = useCheckout()
  const { state: cartState } = useCartContext()
  const [promoCode, setPromoCode] = useState('')
  const [isApplyingPromo, setIsApplyingPromo] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discount: number } | null>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  // Calculate totals
  const subtotal = cartState.totalAmount
  const shippingCost = state.shippingInfo?.method.price || 0
  const tax = subtotal * 0.0875 // 8.75% tax rate
  const discount = appliedPromo?.discount || 0
  const total = subtotal + shippingCost + tax - discount

  const handleApplyPromoCode = async () => {
    if (!promoCode.trim()) return

    setIsApplyingPromo(true)
    setPromoError('')
    
    try {
      // Simulate promo code validation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock promo code logic
      const validPromoCodes = {
        'WELCOME10': 10,
        'SAVE15': 15,
        'FREESHIP': shippingCost
      }
      
      const discount = validPromoCodes[promoCode.toUpperCase() as keyof typeof validPromoCodes]
      
      if (discount) {
        setAppliedPromo({
          code: promoCode.toUpperCase(),
          discount: discount
        })
        setPromoCode('')
      } else {
        setPromoError('Invalid promo code')
      }
    } catch (error) {
      setPromoError('Failed to apply promo code')
    } finally {
      setIsApplyingPromo(false)
    }
  }

  const handleRemovePromo = () => {
    setAppliedPromo(null)
    setPromoError('')
  }

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true)
    
    try {
      const orderResult = await placeOrder()
      
      if (orderResult) {
        // Order placed successfully - the context will handle navigation to confirmation
        console.log('Order placed successfully:', orderResult)
      }
    } catch (error) {
      console.error('Failed to place order:', error)
      // Error handling could show a toast or error message
    } finally {
      setIsPlacingOrder(false)
    }
  }

  if (!state.shippingInfo) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <p className="text-gray-600">Please complete the shipping step first</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Order Items */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Order Items</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          {cartState.items.map((item) => (
            <div key={`${item.productId}-${item.variantId || 'default'}`} className="flex items-center gap-4">
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.name}</h4>
                {(item.size || item.color) && (
                  <p className="text-sm text-gray-600">
                    {[item.size, item.color].filter(Boolean).join(', ')}
                  </p>
                )}
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="space-y-1">
            <p className="font-medium text-gray-900">
              {state.shippingInfo.address.firstName} {state.shippingInfo.address.lastName}
            </p>
            {state.shippingInfo.address.company && (
              <p className="text-gray-600">{state.shippingInfo.address.company}</p>
            )}
            <p className="text-gray-600">{state.shippingInfo.address.address1}</p>
            {state.shippingInfo.address.address2 && (
              <p className="text-gray-600">{state.shippingInfo.address.address2}</p>
            )}
            <p className="text-gray-600">
              {state.shippingInfo.address.city}, {state.shippingInfo.address.province} {state.shippingInfo.address.zip}
            </p>
            <p className="text-gray-600">{state.shippingInfo.address.country}</p>
            {state.shippingInfo.address.phone && (
              <p className="text-gray-600">{state.shippingInfo.address.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping Method */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Shipping Method</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{state.shippingInfo.method.name}</p>
              <p className="text-sm text-gray-600">{state.shippingInfo.method.description}</p>
            </div>
            <p className="font-medium text-gray-900">
              {state.shippingInfo.method.price === 0 ? 'FREE' : `$${state.shippingInfo.method.price.toFixed(2)}`}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">••••</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">Credit Card (Mock)</p>
              <p className="text-sm text-gray-600">Ending in 4242</p>
            </div>
          </div>
        </div>
      </div>

      {/* Promo Code */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Promo Code</h3>
        </div>
        
        {appliedPromo ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-600" />
                <span className="font-medium text-green-800">{appliedPromo.code}</span>
                <Badge className="bg-green-100 text-green-800">
                  -${appliedPromo.discount.toFixed(2)}
                </Badge>
              </div>
              <button
                onClick={handleRemovePromo}
                className="text-sm text-green-600 hover:text-green-800"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={setPromoCode}
                  className={promoError ? 'border-red-500' : ''}
                />
              </div>
              <Button
                onClick={handleApplyPromoCode}
                disabled={isApplyingPromo || !promoCode.trim()}
                variant="outline"
                className="px-6"
              >
                {isApplyingPromo ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Applying...
                  </>
                ) : (
                  'Apply'
                )}
              </Button>
            </div>
            {promoError && (
              <p className="text-sm text-red-600">{promoError}</p>
            )}
            <p className="text-xs text-gray-500">
              Try: WELCOME10, SAVE15, or FREESHIP
            </p>
          </div>
        )}
      </div>

      {/* Order Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Order Summary</h3>
        
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({cartState.totalItems} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          
          {appliedPromo && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Discount ({appliedPromo.code})</span>
              <span>-${appliedPromo.discount.toFixed(2)}</span>
            </div>
          )}
          
          <div className="border-t pt-3 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Trust Signals */}
      <div className="flex items-center justify-center gap-6 py-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-4 h-4 text-green-500" />
          <span>Encrypted Checkout</span>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="pt-4">
        <Button
          onClick={handlePlaceOrder}
          disabled={isPlacingOrder}
          className="w-full bg-[#e53e3e] hover:bg-[#c53030] text-white py-4 text-lg font-semibold"
        >
          {isPlacingOrder ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Placing Your Order...
            </>
          ) : (
            `Place Order - $${total.toFixed(2)}`
          )}
        </Button>
        
        <p className="text-center text-xs text-gray-500 mt-2">
          By placing your order, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
} 