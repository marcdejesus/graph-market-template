import { MainLayout } from '@/components/layout/main-layout'
import { ResponsiveBreadcrumb } from '@/components/navigation/breadcrumb'
import { notFound } from 'next/navigation'

const categoryInfo: Record<string, { name: string; description: string }> = {
  'tops': {
    name: 'Tops',
    description: 'Performance tops, t-shirts, tank tops, and athletic wear for your active lifestyle.'
  },
  'bottoms': {
    name: 'Bottoms',
    description: 'Athletic shorts, leggings, joggers, and performance bottoms for any workout.'
  },
  'outerwear': {
    name: 'Outerwear',
    description: 'Hoodies, jackets, and athletic outerwear to keep you comfortable in any weather.'
  },
  'accessories': {
    name: 'Accessories',
    description: 'Essential gym accessories, bags, hats, and gear to complete your athletic setup.'
  }
}

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params
  const categoryData = categoryInfo[category]

  if (!categoryData) {
    notFound()
  }

  return (
    <MainLayout padded>
      <ResponsiveBreadcrumb className="mb-6" />
      
      <div className="py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bebas font-bold text-athletic-black mb-4">
            {categoryData.name}
          </h1>
          <p className="text-lg text-steel-600 max-w-2xl mx-auto">
            {categoryData.description}
          </p>
        </div>

        {/* Filters (placeholder) */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <button className="px-4 py-2 bg-athletic-black text-white rounded-md text-sm font-medium hover:bg-primary-800 transition-colors">
            All
          </button>
          <button className="px-4 py-2 bg-white border border-steel-300 text-athletic-black rounded-md text-sm font-medium hover:bg-steel-50 transition-colors">
            Best Sellers
          </button>
          <button className="px-4 py-2 bg-white border border-steel-300 text-athletic-black rounded-md text-sm font-medium hover:bg-steel-50 transition-colors">
            New Arrivals
          </button>
          <button className="px-4 py-2 bg-white border border-steel-300 text-athletic-black rounded-md text-sm font-medium hover:bg-steel-50 transition-colors">
            On Sale
          </button>
        </div>

        {/* Product Grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-steel-200 overflow-hidden hover:shadow-md transition-shadow group">
              <div className="aspect-square bg-steel-100 flex items-center justify-center group-hover:bg-steel-200 transition-colors">
                <svg className="h-12 w-12 text-steel-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-athletic-black group-hover:text-performance-500 transition-colors">
                  {categoryData.name} Product {i + 1}
                </h3>
                <p className="text-sm text-steel-600">{categoryData.name}</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-lg font-semibold text-athletic-black">
                    ${(34.99 + i * 3).toFixed(2)}
                  </p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                    In Stock
                  </span>
                </div>
                <button className="mt-3 w-full bg-athletic-black text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-800 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-white border border-steel-300 text-athletic-black rounded-md font-medium hover:bg-steel-50 transition-colors">
            Load More Products
          </button>
        </div>
      </div>
    </MainLayout>
  )
}

export function generateStaticParams() {
  return [
    { category: 'tops' },
    { category: 'bottoms' },
    { category: 'outerwear' },
    { category: 'accessories' }
  ]
} 