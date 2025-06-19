import { MainLayout } from '@/components/layout/main-layout'
import { ResponsiveBreadcrumb } from '@/components/navigation/breadcrumb'
import { notFound } from 'next/navigation'

const collectionInfo: Record<string, { 
  name: string
  description: string
  category: string
  featured?: boolean
}> = {
  'performance-tees': {
    name: 'Performance Tees',
    description: 'Latest moisture-wicking technology for ultimate performance and comfort.',
    category: 'Tops',
    featured: true
  },
  'premium-leggings': {
    name: 'Premium Leggings',
    description: 'Ultra-comfortable high-performance leggings for every workout.',
    category: 'Bottoms',
    featured: true
  },
  'winter': {
    name: 'Winter Collection',
    description: 'Stay warm during winter workouts with our thermal athletic wear.',
    category: 'Outerwear',
    featured: true
  },
  'gym-essentials': {
    name: 'Gym Essentials',
    description: 'Everything you need for your workout, from bags to water bottles.',
    category: 'Accessories',
    featured: true
  }
}

interface CollectionPageProps {
  params: {
    collection: string
  }
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const { collection } = params
  const collectionData = collectionInfo[collection]

  if (!collectionData) {
    notFound()
  }

  return (
    <MainLayout padded>
      <ResponsiveBreadcrumb className="mb-6" />
      
      <div className="py-8">
        {/* Collection Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-performance-100 text-performance-800">
              {collectionData.category}
            </span>
            {collectionData.featured && (
              <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-energy-100 text-energy-800">
                Featured Collection
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bebas font-bold text-athletic-black mb-4">
            {collectionData.name}
          </h1>
          <p className="text-lg text-steel-600 max-w-2xl mx-auto">
            {collectionData.description}
          </p>
        </div>

        {/* Collection Filters */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <button className="px-4 py-2 bg-athletic-black text-white rounded-md text-sm font-medium hover:bg-primary-800 transition-colors">
            All Items
          </button>
          <button className="px-4 py-2 bg-white border border-steel-300 text-athletic-black rounded-md text-sm font-medium hover:bg-steel-50 transition-colors">
            Best Sellers
          </button>
          <button className="px-4 py-2 bg-white border border-steel-300 text-athletic-black rounded-md text-sm font-medium hover:bg-steel-50 transition-colors">
            New Arrivals
          </button>
          <button className="px-4 py-2 bg-white border border-steel-300 text-athletic-black rounded-md text-sm font-medium hover:bg-steel-50 transition-colors">
            Price: Low to High
          </button>
          <button className="px-4 py-2 bg-white border border-steel-300 text-athletic-black rounded-md text-sm font-medium hover:bg-steel-50 transition-colors">
            Price: High to Low
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-steel-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-square bg-gradient-to-br from-steel-100 to-steel-200 flex items-center justify-center group-hover:from-steel-200 group-hover:to-steel-300 transition-all duration-300">
                <div className="text-center text-steel-500">
                  <svg className="h-16 w-16 mx-auto mb-2 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs font-medium">{collectionData.name}</p>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-athletic-black group-hover:text-performance-500 transition-colors">
                  {collectionData.name.split(' ')[0]} Item #{i + 1}
                </h3>
                <p className="text-sm text-steel-600">{collectionData.category}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-lg font-semibold text-athletic-black">
                    ${(39.99 + i * 5 + Math.floor(Math.random() * 20)).toFixed(2)}
                  </p>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, star) => (
                      <svg 
                        key={star} 
                        className={`h-3 w-3 ${star < 4 ? 'text-energy-400' : 'text-steel-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-xs text-steel-500 ml-1">(24)</span>
                  </div>
                </div>
                
                {/* Size options */}
                <div className="mt-3 flex space-x-1">
                  {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                    <button 
                      key={size}
                      className="flex-1 text-xs py-1 border border-steel-200 rounded text-steel-600 hover:border-performance-300 hover:text-performance-600 transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
                
                <button className="mt-3 w-full bg-athletic-black text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-white border border-steel-300 text-athletic-black rounded-md font-medium hover:bg-steel-50 transition-colors">
            Load More Products
          </button>
        </div>

        {/* Collection Features */}
        <div className="mt-16 bg-steel-50 rounded-lg p-8">
          <h2 className="text-2xl font-bebas font-bold text-athletic-black text-center mb-8">
            Why Choose {collectionData.name}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-performance-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-performance-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-athletic-black mb-2">Performance First</h3>
              <p className="text-steel-600 text-sm">Designed with cutting-edge materials for maximum performance and comfort.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-performance-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-performance-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-athletic-black mb-2">Quality Guaranteed</h3>
              <p className="text-steel-600 text-sm">Every piece is tested for durability and backed by our satisfaction guarantee.</p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-performance-100 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-performance-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-athletic-black mb-2">Athlete Approved</h3>
              <p className="text-steel-600 text-sm">Trusted by professional athletes and fitness enthusiasts worldwide.</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export function generateStaticParams() {
  return [
    { collection: 'performance-tees' },
    { collection: 'premium-leggings' },
    { collection: 'winter' },
    { collection: 'gym-essentials' }
  ]
} 