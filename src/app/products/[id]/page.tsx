'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { ResponsiveBreadcrumb } from '@/components/navigation/breadcrumb'
import { getProductById, mockProducts } from '@/lib/mockData'
import { notFound } from 'next/navigation'
import { ProductImageGallery } from '@/components/products/product-detail/product-image-gallery'
import { ProductVariantSelector } from '@/components/products/product-detail/product-variant-selector'
import { RelatedProducts } from '@/components/products/product-detail/related-products'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { useToast } from '@/components/ui/toast'
import { Badge } from '@/components/ui/badge'
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw } from 'lucide-react'
import { Product } from '@/types'

interface ProductDetailPageProps {
  params: { id: string }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = params
  const product = getProductById(id)
  const { addToCart } = useCart()
  const { success: toastSuccess, error: toastError } = useToast()

  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  if (!product) {
    notFound()
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = mockProducts
    .filter((p: Product) => p.category === product.category && p.id !== product.id)
    .slice(0, 8)

  // Calculate discounted price if available
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercentage = hasDiscount && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  // Get size variants for stock validation
  const sizeVariants = product.variants.filter(v => v.type === 'size')
  const selectedVariant = sizeVariants.find(v => v.value === selectedSize)

  const canAddToCart = selectedSize && selectedVariant && selectedVariant.stock > 0

  const handleAddToCart = () => {
    if (!canAddToCart || !selectedVariant) {
      toastError('Please select a size')
      return
    }

    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: selectedQuantity,
      size: selectedSize,
      imageUrl: product.images[0]?.url || '/images/placeholder.jpg',
      maxQuantity: selectedVariant.stock,
      variantId: selectedVariant.id
    }

    addToCart(cartItem)
    toastSuccess(`Added ${selectedQuantity} ${product.name} to cart`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href
        })
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toastSuccess('Link copied to clipboard')
      } catch (error) {
        toastError('Could not copy link')
      }
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toastSuccess(isFavorite ? 'Removed from favorites' : 'Added to favorites')
  }

  return (
    <MainLayout padded>
      <ResponsiveBreadcrumb className="mb-6" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="order-1">
            <ProductImageGallery 
              images={product.images} 
              productName={product.name}
            />
          </div>

          {/* Product Information */}
          <div className="order-2 space-y-6">
            {/* Product Title and Badges */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {!product.inStock && (
                  <Badge variant="error">Out of Stock</Badge>
                )}
                {hasDiscount && (
                  <Badge variant="error">{discountPercentage}% OFF</Badge>
                )}
                {product.tags.includes('new') && (
                  <Badge variant="info">New</Badge>
                )}
                {product.tags.includes('bestseller') && (
                  <Badge variant="success">Best Seller</Badge>
                )}
              </div>
              
              <h1 className="text-4xl font-bebas font-bold text-athletic-black mb-2">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-steel-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-steel-600">(4.2) • 127 reviews</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-athletic-black">
                  ${product.price.toFixed(2)}
                </span>
                {hasDiscount && product.compareAtPrice && (
                  <span className="text-xl text-steel-500 line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              {hasDiscount && product.compareAtPrice && (
                <p className="text-sm text-performance-600">
                  You save ${(product.compareAtPrice - product.price).toFixed(2)}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <p className="text-steel-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Variant Selector */}
            <ProductVariantSelector
              variants={product.variants}
              selectedSize={selectedSize}
              selectedQuantity={selectedQuantity}
              onSizeChange={setSelectedSize}
              onQuantityChange={setSelectedQuantity}
            />

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!canAddToCart}
                  className="flex-1 h-12"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                
                <Button
                  variant="outline"
                  onClick={toggleFavorite}
                  className="h-12 px-4"
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="h-12 px-4"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>

              {!product.inStock && (
                <Button variant="outline" className="w-full h-12" disabled>
                  Notify When Available
                </Button>
              )}
            </div>

            {/* Product Features */}
            <div className="border-t border-steel-200 pt-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-performance-600" />
                  <span className="text-sm text-steel-700">Free shipping on orders over $75</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="h-5 w-5 text-performance-600" />
                  <span className="text-sm text-steel-700">30-day return policy</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-performance-600" />
                  <span className="text-sm text-steel-700">1-year warranty included</span>
                </div>
              </div>
            </div>

            {/* Product Details Accordion */}
            <div className="border-t border-steel-200 pt-6">
              <details className="group">
                <summary className="flex justify-between items-center cursor-pointer text-athletic-black font-semibold">
                  Product Details
                  <span className="text-steel-400 group-open:rotate-180 transition-transform">
                    ↓
                  </span>
                </summary>
                <div className="mt-4 text-sm text-steel-700 space-y-2">
                  <p><strong>Material:</strong> 90% Polyester, 10% Spandex</p>
                  <p><strong>Care:</strong> Machine wash cold, tumble dry low</p>
                  <p><strong>Fit:</strong> Athletic fit with moisture-wicking technology</p>
                  <p><strong>Features:</strong> Quick-dry, breathable, anti-odor</p>
                </div>
              </details>
              
              <details className="group mt-4">
                <summary className="flex justify-between items-center cursor-pointer text-athletic-black font-semibold">
                  Size & Fit
                  <span className="text-steel-400 group-open:rotate-180 transition-transform">
                    ↓
                  </span>
                </summary>
                <div className="mt-4 text-sm text-steel-700">
                  <p>Model is 6'2" and wearing size Large. True to size fit with room for movement during workouts.</p>
                </div>
              </details>
              
              <details className="group mt-4">
                <summary className="flex justify-between items-center cursor-pointer text-athletic-black font-semibold">
                  Shipping & Returns
                  <span className="text-steel-400 group-open:rotate-180 transition-transform">
                    ↓
                  </span>
                </summary>
                <div className="mt-4 text-sm text-steel-700 space-y-2">
                  <p><strong>Shipping:</strong> Free on orders $75+, otherwise $8.99</p>
                  <p><strong>Delivery:</strong> 3-5 business days standard</p>
                  <p><strong>Returns:</strong> 30 days from purchase date</p>
                  <p><strong>Exchanges:</strong> Free size/color exchanges</p>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </MainLayout>
  )
}
