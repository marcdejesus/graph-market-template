'use client'

import { useMemo } from 'react'
import { ProductVariant } from '@/types'
import { Button } from '@/components/ui/button'
import { Minus, Plus } from 'lucide-react'

interface ProductVariantSelectorProps {
  variants: ProductVariant[]
  selectedSize?: string
  selectedQuantity: number
  onSizeChange: (_size: string) => void
  onQuantityChange: (_quantity: number) => void
  maxQuantity?: number
  className?: string
}

export function ProductVariantSelector({
  variants,
  selectedSize,
  selectedQuantity,
  onSizeChange,
  onQuantityChange,
  maxQuantity = 10,
  className = ''
}: ProductVariantSelectorProps) {
  // Group variants by type
  const sizeVariants = variants.filter(variant => variant.type === 'size')
  const colorVariants = variants.filter(variant => variant.type === 'color')

  // Get current variant info for stock validation
  const selectedVariant = useMemo(() => {
    return sizeVariants.find(variant => variant.value === selectedSize)
  }, [sizeVariants, selectedSize])

  const availableStock = selectedVariant?.stock || 0
  const maxAllowedQuantity = Math.min(maxQuantity, availableStock)

  const handleQuantityDecrease = () => {
    if (selectedQuantity > 1) {
      onQuantityChange(selectedQuantity - 1)
    }
  }

  const handleQuantityIncrease = () => {
    if (selectedQuantity < maxAllowedQuantity) {
      onQuantityChange(selectedQuantity + 1)
    }
  }

  const isVariantOutOfStock = (variant: ProductVariant) => {
    return variant.stock === 0
  }

  const isVariantLowStock = (variant: ProductVariant) => {
    return variant.stock > 0 && variant.stock <= 5
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Size Selector */}
      {sizeVariants.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-athletic-black mb-3">
            Size {selectedSize && <span className="text-steel-600">- {selectedSize}</span>}
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {sizeVariants.map((variant) => {
              const isSelected = selectedSize === variant.value
              const isOutOfStock = isVariantOutOfStock(variant)
              const isLowStock = isVariantLowStock(variant)

              return (
                <button
                  key={variant.id}
                  onClick={() => !isOutOfStock && onSizeChange(variant.value)}
                  disabled={isOutOfStock}
                  className={`
                    relative p-3 text-center font-medium border-2 rounded-lg transition-all
                    ${isSelected
                      ? 'border-performance-500 bg-performance-50 text-performance-700'
                      : isOutOfStock
                      ? 'border-steel-200 bg-steel-100 text-steel-400 cursor-not-allowed'
                      : 'border-steel-300 bg-white text-athletic-black hover:border-steel-400'
                    }
                  `}
                >
                  <span className="block">{variant.value}</span>
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-0.5 bg-steel-400 rotate-12 transform"></div>
                    </div>
                  )}
                  {isLowStock && !isOutOfStock && (
                    <span className="text-xs text-orange-600 block">Low stock</span>
                  )}
                </button>
              )
            })}
          </div>
          
          {/* Size Guide Link */}
          <button className="text-sm text-performance-600 hover:text-performance-700 underline mt-2">
            Size Guide
          </button>
        </div>
      )}

      {/* Color Selector (if available) */}
      {colorVariants.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-athletic-black mb-3">Color</h3>
          <div className="flex gap-2">
            {colorVariants.map((variant) => (
              <button
                key={variant.id}
                className="w-8 h-8 rounded-full border-2 border-steel-300 hover:border-steel-400"
                style={{ backgroundColor: variant.value.toLowerCase() }}
                title={variant.value}
                aria-label={`Select ${variant.value} color`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div>
        <h3 className="text-lg font-semibold text-athletic-black mb-3">
          Quantity
          {availableStock > 0 && (
            <span className="text-sm text-steel-600 font-normal ml-2">
              ({availableStock} in stock)
            </span>
          )}
        </h3>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center border border-steel-300 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuantityDecrease}
              disabled={selectedQuantity <= 1}
              className="h-10 w-10 p-0 rounded-l-lg rounded-r-none"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <div className="h-10 w-16 flex items-center justify-center border-x border-steel-300 bg-white">
              <span className="font-medium">{selectedQuantity}</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleQuantityIncrease}
              disabled={selectedQuantity >= maxAllowedQuantity}
              className="h-10 w-10 p-0 rounded-r-lg rounded-l-none"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {selectedQuantity >= maxAllowedQuantity && availableStock > 0 && (
            <span className="text-sm text-steel-600">
              Max quantity reached
            </span>
          )}
        </div>

        {/* Stock Status Messages */}
        {selectedVariant && (
          <div className="mt-2">
            {availableStock === 0 && (
              <p className="text-sm text-red-600">Out of stock</p>
            )}
            {availableStock > 0 && availableStock <= 5 && (
              <p className="text-sm text-orange-600">
                Only {availableStock} left in stock
              </p>
            )}
            {availableStock > 5 && (
              <p className="text-sm text-green-600">In stock</p>
            )}
          </div>
        )}
        
        {!selectedSize && sizeVariants.length > 0 && (
          <p className="text-sm text-steel-600 mt-2">
            Please select a size to see availability
          </p>
        )}
      </div>
    </div>
  )
} 