'use client'

import { useState, useMemo, Suspense } from 'react'
import { MainLayout } from '@/components/layout/main-layout'
import { ResponsiveBreadcrumb } from '@/components/navigation/breadcrumb'
import { ProductCard } from '@/components/products/product-card'
import { ProductFilters } from '@/components/products/filters/product-filters'
import { ProductSort } from '@/components/products/filters/product-sort'
import { LoadingSpinner } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import { mockProducts } from '@/lib/mockData'
import { mockAvailableFilters, filterProducts, sortProducts } from '@/lib/mockFilterData'
import { useProductFilters } from '@/hooks/useProductFilters'
import { Filter, X } from 'lucide-react'
import { Product } from '@/types'
import { ProductFilters as ProductFiltersType } from '@/types/product'

function ProductsPageContent() {
  const [showFilters, setShowFilters] = useState(false)
  const [itemsToShow, setItemsToShow] = useState(12)
  const [loading] = useState(false)

  const {
    filters,
    sortOptions,
    setFilter,
    setSortOptions,
    clearFilters,
    hasActiveFilters
  } = useProductFilters()

  // Transform our Product data to work with the filter system
  const adaptedProducts = useMemo(() => {
    return mockProducts.map(product => ({
      ...product,
      category: { slug: product.category },
      isOnSale: !!product.compareAtPrice,
      brand: 'fitmarket', // Default brand for all products
      rating: 4.2 // Default rating
    }))
  }, [])

  // Apply filters and sorting
  const { filteredProducts, totalResults } = useMemo(() => {
    if (!adaptedProducts.length) {
      return { filteredProducts: [], totalResults: 0 }
    }

    // Apply filters
    const filtered = filterProducts(adaptedProducts, filters)
    
    // Apply sorting
    const sorted = sortProducts(filtered, sortOptions)

    return {
      filteredProducts: sorted,
      totalResults: filtered.length
    }
  }, [adaptedProducts, filters, sortOptions])

  // Convert back to original Product type for display
  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, itemsToShow).map(({ category, isOnSale, brand, rating, ...rest }) => ({
      ...rest,
      category: category.slug
    } as Product))
  }, [filteredProducts, itemsToShow])

  const hasMoreProducts = itemsToShow < filteredProducts.length

  const handleLoadMore = () => {
    setItemsToShow(prev => prev + 12)
  }

  const handleFiltersChange = (newFilters: Partial<ProductFiltersType>) => {
    Object.entries(newFilters).forEach(([key, value]) => {
      setFilter(key as keyof ProductFiltersType, value)
    })
  }

  const handleClearFilters = () => {
    clearFilters()
    setItemsToShow(12)
  }

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

        <div className="flex gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden w-full mb-6">
            <div className="flex items-center justify-between">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-performance-500 text-white text-xs rounded-full px-2 py-1 ml-1">
                    {Object.values(filters).filter(v => v && (Array.isArray(v) ? v.length > 0 : true)).length}
                  </span>
                )}
              </Button>
              
              <ProductSort
                sortOptions={sortOptions}
                onSortChange={setSortOptions}
                className="flex-1 max-w-xs ml-4"
              />
            </div>
          </div>

          {/* Filters Sidebar */}
          <div className={`w-full lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            {loading ? (
              <div className="bg-white border border-steel-200 rounded-lg p-6">
                <LoadingSpinner size="md" className="mx-auto" />
              </div>
            ) : (
              <ProductFilters
                filters={filters}
                availableFilters={mockAvailableFilters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                className="sticky top-6"
              />
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Results Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="text-sm text-steel-600">
                  {loading ? (
                    'Loading products...'
                  ) : (
                    `Showing ${displayedProducts.length} of ${totalResults} products`
                  )}
                </div>
                
                {hasActiveFilters && (
                  <Button
                    onClick={handleClearFilters}
                    variant="ghost"
                    size="sm"
                    className="text-performance-600 hover:text-performance-700 hidden sm:flex items-center gap-1"
                  >
                    <X className="h-4 w-4" />
                    Clear filters
                  </Button>
                )}
              </div>
              
              {/* Desktop Sort */}
              <div className="hidden lg:block">
                <ProductSort
                  sortOptions={sortOptions}
                  onSortChange={setSortOptions}
                />
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {filters.category?.map(category => (
                    <div key={category} className="flex items-center gap-1 bg-steel-100 text-steel-800 px-3 py-1 rounded-full text-sm">
                      Category: {category}
                      <button
                        onClick={() => setFilter('category', filters.category?.filter(c => c !== category))}
                        className="ml-1 hover:text-performance-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {filters.sizes?.map(size => (
                    <div key={size} className="flex items-center gap-1 bg-steel-100 text-steel-800 px-3 py-1 rounded-full text-sm">
                      Size: {size.toUpperCase()}
                      <button
                        onClick={() => setFilter('sizes', filters.sizes?.filter(s => s !== size))}
                        className="ml-1 hover:text-performance-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {filters.colors?.map(color => (
                    <div key={color} className="flex items-center gap-1 bg-steel-100 text-steel-800 px-3 py-1 rounded-full text-sm">
                      Color: {color.replace('-', ' ')}
                      <button
                        onClick={() => setFilter('colors', filters.colors?.filter(c => c !== color))}
                        className="ml-1 hover:text-performance-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {filters.priceRange && (
                    <div className="flex items-center gap-1 bg-steel-100 text-steel-800 px-3 py-1 rounded-full text-sm">
                      Price: ${filters.priceRange.min} - ${filters.priceRange.max}
                      <button
                        onClick={() => setFilter('priceRange', undefined)}
                        className="ml-1 hover:text-performance-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {filters.inStock && (
                    <div className="flex items-center gap-1 bg-steel-100 text-steel-800 px-3 py-1 rounded-full text-sm">
                      In Stock Only
                      <button
                        onClick={() => setFilter('inStock', false)}
                        className="ml-1 hover:text-performance-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {filters.onSale && (
                    <div className="flex items-center gap-1 bg-steel-100 text-steel-800 px-3 py-1 rounded-full text-sm">
                      On Sale
                      <button
                        onClick={() => setFilter('onSale', false)}
                        className="ml-1 hover:text-performance-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-steel-100 rounded-lg aspect-[4/5] animate-pulse" />
                ))}
              </div>
            ) : displayedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMoreProducts && (
                  <div className="text-center mt-8">
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      size="lg"
                      className="min-w-[200px]"
                    >
                      Load More Products
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-athletic-black mb-2">
                  No products found
                </h3>
                <p className="text-steel-600 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" className="mx-auto mt-8" />}>
      <ProductsPageContent />
    </Suspense>
  )
} 