'use client'

import { ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyCartStateProps {
  onContinueShopping: () => void
}

export function EmptyCartState({ onContinueShopping }: EmptyCartStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center h-full">
      {/* Illustration */}
      <div className="relative mb-6">
        <div className="bg-gray-100 rounded-full p-8">
          <ShoppingBag className="h-16 w-16 text-gray-400" />
        </div>
        {/* Empty cart indicator */}
        <div className="absolute -top-2 -right-2 bg-red-100 rounded-full p-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 max-w-sm">
        <h3 className="text-lg font-semibold text-gray-900">
          Your cart is empty
        </h3>
        
        <p className="text-sm text-gray-500 leading-relaxed">
          Looks like you haven&apos;t added any items to your cart yet. 
          Start browsing our premium athletic wear collection.
        </p>

        {/* CTA Button */}
        <Button
          onClick={onContinueShopping}
          className="w-full bg-[#e53e3e] hover:bg-[#c53030] text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 mt-6"
        >
          Start Shopping
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Features */}
      <div className="mt-8 space-y-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span>Free shipping on orders over $75</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span>Easy returns within 30 days</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <span>Premium athletic wear quality</span>
        </div>
      </div>
    </div>
  )
} 