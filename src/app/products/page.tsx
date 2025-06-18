import { MainLayout } from '@/components/layout/main-layout'
import { ResponsiveBreadcrumb } from '@/components/navigation/breadcrumb'

export default function ProductsPage() {
  return (
    <MainLayout padded>
      <ResponsiveBreadcrumb className="mb-6" />
      
      <div className="py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bebas font-bold text-athletic-black mb-4">
            All Products
          </h1>
          <p className="text-lg text-steel-600 max-w-2xl mx-auto">
            Discover our complete collection of premium athletic wear designed for performance and style.
          </p>
        </div>

        {/* Placeholder for product grid */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-steel-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-steel-100 flex items-center justify-center">
                <svg className="h-12 w-12 text-steel-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-medium text-athletic-black">
                  Product {i + 1}
                </h3>
                <p className="text-sm text-steel-600">Athletic Wear</p>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-lg font-semibold text-athletic-black">
                    ${(29.99 + i * 5).toFixed(2)}
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
      </div>
    </MainLayout>
  )
} 