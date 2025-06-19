'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { ResponsiveBreadcrumb } from '@/components/navigation/breadcrumb'
import { ProductGrid } from '@/components/products'
import { Button } from '@/components/ui/button'
import { mockProducts } from '@/lib/mockData'
import { Product } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<string>('newest')
  const [itemsToShow, setItemsToShow] = useState(12)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setProducts(mockProducts)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort)
    setLoading(true)
    
    // Simulate API call with sorting
    setTimeout(() => {
             const sortedProducts = [...mockProducts]
      
      switch (newSort) {
        case 'price_asc':
          sortedProducts.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          sortedProducts.sort((a, b) => b.price - a.price)
          break
        case 'name_asc':
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'name_desc':
          sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
          break
        case 'newest':
        default:
          sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
      }
      
      setProducts(sortedProducts)
      setLoading(false)
    }, 500)
  }

  const handleLoadMore = () => {
    setItemsToShow(prev => prev + 12)
  }

  const displayedProducts = products.slice(0, itemsToShow)
  const hasMoreProducts = itemsToShow < products.length

  return (
    <MainLayout padded>
      <ResponsiveBreadcrumb className="mb-6" />
      
      <div className="py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bebas font-bold text-athletic-black mb-4">
            All Products
          </h1>
          <p className="text-lg text-steel-600 max-w-2xl mx-auto">
            Discover our complete collection of premium athletic wear designed for performance and style.
          </p>
        </div>

        {/* Filter and Sort Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-sm text-steel-600">
            <span>Showing {displayedProducts.length} of {products.length} products</span>
          </div>
          
          <div className="flex items-center gap-4">
            <label htmlFor="sort" className="text-sm font-medium text-athletic-black">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
              className="border border-steel-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-performance-500"
            >
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid 
          products={displayedProducts}
          loading={loading}
          className="mb-12"
        />

        {/* Load More Button */}
        {!loading && hasMoreProducts && (
          <div className="text-center">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              className="px-8 py-3"
            >
              Load More Products
            </Button>
          </div>
        )}

        {/* No Products State */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-athletic-black mb-2">
              No products available
            </h3>
            <p className="text-steel-500">
              Check back soon for new arrivals!
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  )
} 