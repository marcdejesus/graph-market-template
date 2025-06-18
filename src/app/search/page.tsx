'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/main-layout'

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  // Mock search results - in real app this would come from API
  const mockResults = [
    {
      id: '1',
      name: 'Nike Performance T-Shirt',
      category: 'Tops',
      price: 29.99,
      image: '/placeholder-product.jpg',
      inStock: true
    },
    {
      id: '2', 
      name: 'Adidas Training Shorts',
      category: 'Bottoms',
      price: 24.99,
      image: '/placeholder-product.jpg',
      inStock: true
    },
    {
      id: '3',
      name: 'Under Armour Hoodie',
      category: 'Outerwear', 
      price: 59.99,
      image: '/placeholder-product.jpg',
      inStock: false
    }
  ].filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.category.toLowerCase().includes(query.toLowerCase())
  )

  if (!query) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <svg className="mx-auto h-12 w-12 text-steel-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="mt-4 text-sm font-medium text-athletic-black">No search query</h3>
          <p className="mt-1 text-sm text-steel-gray">
            Enter a search term to find products.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-athletic-black">
          Search Results for "{query}"
        </h1>
        <p className="text-steel-gray mt-2">
          {mockResults.length} {mockResults.length === 1 ? 'result' : 'results'} found
        </p>
      </div>

      {mockResults.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <svg className="mx-auto h-12 w-12 text-steel-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-athletic-black">No results found</h3>
            <p className="mt-1 text-sm text-steel-gray">
              Try searching with different keywords or browse our categories.
            </p>
            <div className="mt-6">
              <a
                href="/products"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-performance-500 hover:bg-performance-600 transition-colors"
              >
                Browse All Products
              </a>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {mockResults.map((product) => (
            <div key={product.id} className="group">
              <div className="bg-white rounded-lg shadow-sm border border-steel-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-w-1 aspect-h-1 w-full bg-steel-100">
                  <div className="flex items-center justify-center h-48 bg-steel-50">
                    <svg className="h-12 w-12 text-steel-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-athletic-black group-hover:text-performance-500 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-steel-gray">{product.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-lg font-semibold text-athletic-black">
                      ${product.price}
                    </p>
                    {product.inStock ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-steel-100 text-steel-800">
                        Out of Stock
                      </span>
                    )}
                  </div>
                  <button className="mt-3 w-full bg-athletic-black text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-800 transition-colors disabled:bg-steel-300 disabled:cursor-not-allowed" disabled={!product.inStock}>
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <MainLayout padded>
      <Suspense fallback={
        <div className="py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-steel-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-steel-200 rounded w-1/6 mb-8"></div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm border border-steel-200 overflow-hidden">
                  <div className="h-48 bg-steel-100"></div>
                  <div className="p-4">
                    <div className="h-4 bg-steel-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-steel-200 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-steel-200 rounded w-1/3 mb-3"></div>
                    <div className="h-8 bg-steel-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </MainLayout>
  )
} 