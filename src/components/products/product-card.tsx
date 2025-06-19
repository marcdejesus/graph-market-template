'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { ProductImage } from '@/components/ui/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/components/ui/toast'
import { Product } from '@/types'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
  priority?: boolean
}

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addToCart } = useCart()
  const { success: showSuccessToast, error: showErrorToast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Get the first available variant (for simple add to cart)
    const firstVariant = product.variants[0]
    if (!firstVariant || !product.inStock) {
      showErrorToast('Product not available')
      return
    }

    addToCart({
      productId: product.id,
      variantId: firstVariant.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0]?.url || '/placeholder-product.jpg',
      size: firstVariant.value,
      color: undefined,
      quantity: 1,
      maxQuantity: firstVariant.stock || 99
    })

    showSuccessToast(`Added ${product.name} to cart`)
  }

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    showSuccessToast(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist'
    )
  }

  const _getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'h-4 w-4',
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : 'text-steel-300'
        )}
      />
    ))
  }

  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount 
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0

  const isOnSale = hasDiscount
  const isNewProduct = product.tags.includes('new')
  const isBestSeller = product.tags.includes('bestseller')

  return (
    <div 
      className={cn(
        'group relative bg-white rounded-lg shadow-sm border border-steel-200 overflow-hidden',
        'hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1',
        !product.inStock && 'opacity-75',
        className
      )}
    >
      <Link href={`/products/${product.id}` as const} className="block">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-steel-50">
          <ProductImage
            src={product.images[0]?.url || '/placeholder-product.jpg'}
            alt={product.name}
            priority={priority}
            className="transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {isOnSale && (
              <Badge variant="default" className="bg-performance-500 text-xs text-white">
                -{discountPercentage}%
              </Badge>
            )}
            {isNewProduct && (
              <Badge variant="default" className="bg-energy-500 text-xs text-white">
                New
              </Badge>
            )}
            {isBestSeller && (
              <Badge variant="default" className="bg-success-500 text-xs text-white">
                Best Seller
              </Badge>
            )}
            {!product.inStock && (
              <Badge variant="outline" className="text-xs">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={cn(
              'absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
              'hover:bg-white focus:outline-none focus:ring-2 focus:ring-performance-500',
              isWishlisted && 'opacity-100'
            )}
          >
            <Heart 
              className={cn(
                'h-4 w-4',
                isWishlisted ? 'text-performance-500 fill-current' : 'text-steel-600'
              )}
            />
          </button>

          {/* Quick Add to Cart - appears on hover */}
          {product.inStock && (
            <div 
              className={cn(
                'absolute bottom-3 left-3 right-3 opacity-0 transform translate-y-2',
                'group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200'
              )}
            >
              <Button
                onClick={() => handleAddToCart({} as React.MouseEvent)}
                className="w-full bg-athletic-black hover:bg-athletic-black/90 text-white"
                size="sm"
                type="button"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Quick Add
              </Button>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-steel-500 mb-1">
            <span>FitMarket</span>
            <span className="capitalize">{product.category}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-medium text-athletic-black group-hover:text-performance-600 transition-colors line-clamp-2 mb-1">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-semibold text-athletic-black">
              ${product.price.toFixed(2)}
            </span>
            
            {hasDiscount && (
              <span className="text-sm text-steel-500 line-through">
                ${product.compareAtPrice!.toFixed(2)}
              </span>
            )}
          </div>

          {/* Available Sizes */}
          {product.variants.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {product.variants
                .slice(0, 4)
                .map(variant => (
                  <span 
                    key={variant.id}
                    className="px-2 py-1 text-xs bg-steel-100 text-steel-600 rounded"
                  >
                    {variant.value}
                  </span>
                ))
              }
              {product.variants.length > 4 && (
                <span className="px-2 py-1 text-xs bg-steel-100 text-steel-600 rounded">
                  +{product.variants.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
} 