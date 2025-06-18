'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { ResponsiveBreadcrumb } from '@/components/navigation/breadcrumb'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui'
import Link from 'next/link'

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart()

  if (cart.items.length === 0) {
    return (
      <MainLayout padded>
        <ResponsiveBreadcrumb className="mb-6" />
        
        <div className="py-16 text-center">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-16 w-16 text-steel-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
            </svg>
            <h2 className="text-2xl font-bebas font-bold text-athletic-black mb-2">
              Your cart is empty
            </h2>
            <p className="text-steel-600 mb-6">
              Add some products to get started with your order.
            </p>
            <Link href={"/products" as any}>
              <Button variant="primary" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout padded>
      <ResponsiveBreadcrumb className="mb-6" />
      
      <div className="py-8">
        <h1 className="text-3xl font-bebas font-bold text-athletic-black mb-8">
          Shopping Cart ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={`${item.productId}-${item.size}-${item.color}`} className="bg-white border border-steel-200 rounded-lg p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-full sm:w-24 h-24 bg-steel-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <svg className="h-8 w-8 text-steel-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-athletic-black">{item.name}</h3>
                    <div className="mt-1 text-sm text-steel-600 space-y-1">
                      {item.size && <p>Size: {item.size}</p>}
                      {item.color && <p>Color: {item.color}</p>}
                    </div>
                    <p className="mt-2 text-lg font-semibold text-athletic-black">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col sm:items-end gap-2">
                    <div className="flex items-center border border-steel-300 rounded-md">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.size, item.color)}
                        className="px-3 py-1 hover:bg-steel-50 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.size, item.color)}
                        className="px-3 py-1 hover:bg-steel-50 transition-colors"
                        disabled={item.quantity >= item.maxQuantity}
                      >
                        +
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.productId, item.size, item.color)}
                      className="text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-steel-200 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-athletic-black mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-steel-600">Subtotal ({cart.totalItems} items)</span>
                  <span className="font-medium">${cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-steel-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-steel-600">Tax</span>
                  <span className="font-medium">${(cart.totalAmount * 0.08).toFixed(2)}</span>
                </div>
                <hr className="border-steel-200" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${(cart.totalAmount * 1.08).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="primary" size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
                <Link href={"/products" as any}>
                  <Button variant="outline" size="lg" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 