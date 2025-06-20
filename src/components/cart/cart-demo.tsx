'use client'

import { useState } from 'react'
import { useCartEnhanced } from '@/hooks/useCartEnhanced'
import { Button } from '@/components/ui'
import { CartItem } from '@/types'

export function CartDemo() {
  const [selectedProduct, setSelectedProduct] = useState<string>('demo-product-1')
  const cart = useCartEnhanced()

  // Mock products for demo
  const mockProducts: Array<Omit<CartItem, 'quantity'>> = [
    {
      productId: 'demo-product-1',
      name: 'Performance Training Tee',
      price: 29.99,
      size: 'M',
      color: 'Black',
      imageUrl: 'https://via.placeholder.com/150',
      maxQuantity: 10
    },
    {
      productId: 'demo-product-2',
      name: 'Athletic Leggings',
      price: 59.99,
      size: 'L',
      color: 'Navy',
      imageUrl: 'https://via.placeholder.com/150',
      maxQuantity: 5
    },
    {
      productId: 'demo-product-3',
      name: 'Yoga Mat',
      price: 39.99,
      size: 'Standard',
      color: 'Purple',
      imageUrl: 'https://via.placeholder.com/150',
      maxQuantity: 3
    }
  ]

  const handleAddToCart = async () => {
    const product = mockProducts.find(p => p.productId === selectedProduct)
    if (product) {
      await cart.addToCart(product)
    }
  }

  const handleClearCart = async () => {
    await cart.clearCart()
  }

  const handleSyncTest = async () => {
    await cart.syncWithServer()
  }

  const validateCart = () => {
    const validation = cart.validateCartBeforeCheckout()
    alert(`Cart is ${validation.isValid ? 'valid' : 'invalid'}. ${validation.errors.join(', ')}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bebas font-bold text-athletic-black mb-6">
        Enhanced Cart Demo
      </h2>

      {/* Product Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-athletic-black mb-2">
          Select Product to Add:
        </label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="w-full px-3 py-2 border border-steel-300 rounded-md focus:outline-none focus:ring-2 focus:ring-performance-500"
        >
          {mockProducts.map(product => (
            <option key={product.productId} value={product.productId}>
              {product.name} - ${product.price} ({product.size}, {product.color})
            </option>
          ))}
        </select>
      </div>

      {/* Cart Actions */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <Button 
          onClick={handleAddToCart}
          variant="primary"
          disabled={cart.isLoading}
        >
          Add to Cart
        </Button>
        <Button 
          onClick={handleClearCart}
          variant="outline"
          disabled={cart.isLoading}
        >
          Clear Cart
        </Button>
        <Button 
          onClick={handleSyncTest}
          variant="secondary"
          disabled={cart.isLoading}
        >
          Test Sync
        </Button>
        <Button 
          onClick={validateCart}
          variant="secondary"
        >
          Validate Cart
        </Button>
      </div>

      {/* Cart Summary */}
      <div className="bg-steel-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-athletic-black mb-3">Cart Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-steel-600">Items: <span className="font-medium text-athletic-black">{cart.cartSummary.itemCount}</span></div>
            <div className="text-steel-600">Subtotal: <span className="font-medium text-athletic-black">${cart.cartSummary.subtotal.toFixed(2)}</span></div>
            <div className="text-steel-600">Tax: <span className="font-medium text-athletic-black">${cart.cartSummary.tax.toFixed(2)}</span></div>
            <div className="text-steel-600">Shipping: <span className="font-medium text-athletic-black">${cart.cartSummary.shipping.toFixed(2)}</span></div>
            <div className="text-athletic-black font-semibold">Total: ${cart.cartSummary.total.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-steel-600">Weight: <span className="font-medium text-athletic-black">{cart.getCartWeight().toFixed(1)} lbs</span></div>
            <div className="text-steel-600">Unique Items: <span className="font-medium text-athletic-black">{cart.getTotalUniqueItems()}</span></div>
            <div className="text-steel-600">Estimated Delivery: <span className="font-medium text-athletic-black">{cart.getEstimatedDelivery().toLocaleDateString()}</span></div>
            <div className="text-steel-600">Last Updated: <span className="font-medium text-athletic-black">{cart.cart.lastUpdated.toLocaleTimeString()}</span></div>
          </div>
        </div>
      </div>

      {/* Cart Status */}
      <div className="bg-white border border-steel-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-athletic-black mb-3">Cart Status</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-steel-600">Loading:</span>
            <span className={cart.isLoading ? 'text-performance-600' : 'text-green-600'}>
              {cart.isLoading ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-steel-600">Online:</span>
            <span className={cart.isOnline ? 'text-green-600' : 'text-amber-600'}>
              {cart.isOnline ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-steel-600">Has Pending Sync:</span>
            <span className={cart.hasPendingSync ? 'text-amber-600' : 'text-green-600'}>
              {cart.hasPendingSync ? 'Yes' : 'No'}
            </span>
          </div>
          {cart.error && (
            <div className="text-red-600 text-xs">
              Error: {cart.error}
            </div>
          )}
          {cart.lastSyncedAt && (
            <div className="text-steel-600 text-xs">
              Last Synced: {cart.lastSyncedAt.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Cart Items */}
      {cart.cart.items.length > 0 && (
        <div className="bg-white border border-steel-200 rounded-lg p-4">
          <h3 className="font-semibold text-athletic-black mb-3">Cart Items</h3>
          <div className="space-y-2">
            {cart.cart.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-steel-100 last:border-b-0">
                <div>
                  <div className="font-medium text-athletic-black">{item.name}</div>
                  <div className="text-sm text-steel-600">{item.size} | {item.color}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{item.quantity}x ${item.price.toFixed(2)}</div>
                  <div className="text-sm text-steel-600">${(item.quantity * item.price).toFixed(2)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Promo Code Test */}
      <div className="mt-6 bg-steel-50 rounded-lg p-4">
        <h3 className="font-semibold text-athletic-black mb-3">Test Promo Codes</h3>
        <div className="grid grid-cols-3 gap-2">
          {['WELCOME10', 'SAVE20', 'FREESHIP', 'INVALID'].map(code => (
            <Button
              key={code}
              variant="outline"
              size="sm"
              onClick={async () => {
                const result = await cart.applyPromoCode(code)
                alert(`${code}: ${result.success ? 'Valid' : 'Invalid'} - ${result.message}`)
              }}
              className="text-xs"
            >
              {code}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
} 