'use client'

import { useState } from 'react'
import { CategoryProductGrid } from '@/components/products'
import { Button } from '@/components/ui/button'
import { getProductsByCategory } from '@/lib/mockData'
import { Product, ProductCategory } from '@/types'

interface CategoryPageClientProps {
  category: ProductCategory
  categoryData: { name: string; description: string }
  initialProducts: Product[]
}

export function CategoryPageClient({ 
  category, 
  categoryData, 
  initialProducts 
}: CategoryPageClientProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<string>('all')

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    setLoading(true)
    
    // Simulate API call with filtering
    setTimeout(() => {
      let filteredProducts = getProductsByCategory(category)
      
      switch (newFilter) {
        case 'bestseller':
          filteredProducts = filteredProducts.filter(p => p.tags.includes('bestseller'))
          break
        case 'new':
          filteredProducts = filteredProducts.filter(p => p.tags.includes('new'))
          break
        case 'sale':
          filteredProducts = filteredProducts.filter(p => p.compareAtPrice && p.compareAtPrice > p.price)
          break
        case 'all':
        default:
          break
      }
      
      setProducts(filteredProducts)
      setLoading(false)
    }, 400)
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bebas font-bold text-athletic-black mb-4">
          {categoryData.name}
        </h1>
        <p className="text-lg text-steel-600 max-w-2xl mx-auto">
          {categoryData.description}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 justify-center mb-8">
        <Button
          onClick={() => handleFilterChange('all')}
          variant={filter === 'all' ? 'primary' : 'outline'}
          size="sm"
          className={filter === 'all' ? 'bg-athletic-black text-white' : ''}
        >
          All
        </Button>
        <Button
          onClick={() => handleFilterChange('bestseller')}
          variant={filter === 'bestseller' ? 'primary' : 'outline'}
          size="sm"
          className={filter === 'bestseller' ? 'bg-athletic-black text-white' : ''}
        >
          Best Sellers
        </Button>
        <Button
          onClick={() => handleFilterChange('new')}
          variant={filter === 'new' ? 'primary' : 'outline'}
          size="sm"
          className={filter === 'new' ? 'bg-athletic-black text-white' : ''}
        >
          New Arrivals
        </Button>
        <Button
          onClick={() => handleFilterChange('sale')}
          variant={filter === 'sale' ? 'primary' : 'outline'}
          size="sm"
          className={filter === 'sale' ? 'bg-athletic-black text-white' : ''}
        >
          On Sale
        </Button>
      </div>

      {/* Product Grid */}
      <CategoryProductGrid 
        products={products}
        loading={loading}
      />

      {/* Category Benefits */}
      {!loading && products.length > 0 && (
        <div className="mt-16 bg-steel-50 rounded-lg p-8">
          <h2 className="text-2xl font-bebas font-bold text-athletic-black mb-4 text-center">
            Why Choose {categoryData.name}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-performance-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-medium text-athletic-black mb-2">Premium Performance</h3>
              <p className="text-sm text-steel-600">Designed with cutting-edge materials for maximum performance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-performance-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-medium text-athletic-black mb-2">Quality Guarantee</h3>
              <p className="text-sm text-steel-600">100% satisfaction guarantee with premium construction</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-performance-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-medium text-athletic-black mb-2">Fast Shipping</h3>
              <p className="text-sm text-steel-600">Free shipping on orders over $75 with fast delivery</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 