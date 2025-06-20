'use client'

import { ShoppingBag } from 'lucide-react'
import { useCartContext } from '@/context/cart-context'

interface CartIconProps {
  className?: string
  onClick?: () => void
  showBadge?: boolean
}

export function CartIcon({ className = '', onClick, showBadge = true }: CartIconProps) {
  const { state } = useCartContext()

  return (
    <button
      onClick={onClick}
      className={`relative p-2 text-gray-600 hover:text-gray-900 transition-colors ${className}`}
      aria-label={`Shopping cart with ${state.totalItems} items`}
    >
      <ShoppingBag className="h-6 w-6" />
      
      {showBadge && state.totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#e53e3e] text-white text-xs font-semibold min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 animate-in zoom-in-50 duration-200">
          {state.totalItems > 99 ? '99+' : state.totalItems}
        </span>
      )}

      {/* Loading indicator */}
      {state.isLoading && (
        <div className="absolute -top-1 -right-1 w-3 h-3">
          <div className="animate-spin rounded-full h-full w-full border-2 border-[#e53e3e] border-t-transparent"></div>
        </div>
      )}
    </button>
  )
} 