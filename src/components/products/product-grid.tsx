'use client'

import { ProductCard } from './product-card'
import { ProductGridSkeleton } from '@/components/ui/loading'
import { Product } from '@/types'
import { cn } from '@/lib/utils'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  className?: string
  columns?: 2 | 3 | 4 | 5
  gap?: 'sm' | 'md' | 'lg'
}

export function ProductGrid({ 
  products, 
  loading = false, 
  className,
  columns = 4,
  gap = 'md'
}: ProductGridProps) {
  
  const columnClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'
  }

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8'
  }

  if (loading) {
    return (
      <ProductGridSkeleton 
        count={columns * 3} 
        className={cn('grid', columnClasses[columns], gapClasses[gap], className)} 
      />
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <svg 
            className="h-24 w-24 mx-auto text-steel-300 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1} 
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
            />
          </svg>
          <h3 className="text-lg font-medium text-athletic-black mb-2">
            No products found
          </h3>
          <p className="text-steel-500 mb-6">
            We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
          </p>
          <button className="px-6 py-3 bg-athletic-black text-white rounded-md hover:bg-athletic-black/90 transition-colors">
            Browse All Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('grid', columnClasses[columns], gapClasses[gap], className)}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < columns} // Prioritize first row for loading
        />
      ))}
    </div>
  )
}

// Specialized grid variants for different use cases
export function FeaturedProductGrid({ products, loading }: { products: Product[]; loading?: boolean }) {
  return (
    <ProductGrid
      products={products}
      loading={loading}
      columns={3}
      gap="lg"
      className="max-w-6xl mx-auto"
    />
  )
}

export function RelatedProductGrid({ products, loading }: { products: Product[]; loading?: boolean }) {
  return (
    <ProductGrid
      products={products}
      loading={loading}
      columns={4}
      gap="md"
    />
  )
}

export function CategoryProductGrid({ products, loading }: { products: Product[]; loading?: boolean }) {
  return (
    <ProductGrid
      products={products}
      loading={loading}
      columns={4}
      gap="md"
    />
  )
} 