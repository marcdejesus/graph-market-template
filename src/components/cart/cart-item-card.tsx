'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCartContext } from '@/context/cart-context'
import { CartItem } from '@/types'
import { Button } from '@/components/ui/button'

interface CartItemCardProps {
  item: CartItem
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart, state } = useCartContext()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemove()
      return
    }
    
    if (newQuantity <= item.maxQuantity) {
      updateQuantity(item.productId, newQuantity, item.size, item.color)
    }
  }

  const handleRemove = () => {
    removeFromCart(item.productId, item.size, item.color)
  }

  const isUpdating = state.isLoading

  return (
    <div className={`flex gap-4 ${isUpdating ? 'opacity-50' : ''} transition-opacity`}>
      {/* Product Image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover object-center"
          sizes="96px"
        />
      </div>

      {/* Product Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
              {item.name}
            </h3>
            
            {/* Variants */}
            <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
              {item.size && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Size: {item.size}
                </span>
              )}
              {item.color && (
                <span className="bg-gray-100 px-2 py-1 rounded">
                  Color: {item.color}
                </span>
              )}
            </div>

            {/* Price */}
            <p className="mt-1 text-sm font-semibold text-gray-900">
              ${item.price.toFixed(2)}
            </p>
          </div>

          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isUpdating}
            className="h-8 w-8 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Quantity Controls */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center border border-gray-300 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={isUpdating || item.quantity <= 1}
              className="h-8 w-8 p-0 rounded-l-lg rounded-r-none border-r border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <div className="flex h-8 w-12 items-center justify-center bg-white">
              <span className="text-sm font-medium text-gray-900">
                {item.quantity}
              </span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={isUpdating || item.quantity >= item.maxQuantity}
              className="h-8 w-8 p-0 rounded-r-lg rounded-l-none border-l border-gray-300 hover:bg-gray-50 disabled:opacity-50"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Item Total */}
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-gray-500">
                ${item.price.toFixed(2)} each
              </p>
            )}
          </div>
        </div>

        {/* Stock Warning */}
        {item.quantity >= item.maxQuantity && (
          <p className="mt-1 text-xs text-amber-600">
            Maximum quantity available: {item.maxQuantity}
          </p>
        )}
      </div>
    </div>
  )
} 