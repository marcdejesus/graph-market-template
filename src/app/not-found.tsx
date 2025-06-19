import Link from 'next/link'
import { Button } from '@/components/ui'

export const metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-steel-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* 404 Icon */}
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-performance-100 mb-6">
            <svg className="h-10 w-10 text-performance-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h1 className="text-6xl font-bebas font-bold text-athletic-black mb-4">
            404
          </h1>
          
          <h2 className="text-xl font-semibold text-athletic-black mb-2">
            Page Not Found
          </h2>
          
          <p className="text-steel-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="primary" className="w-full sm:w-auto">
                Go Home
              </Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="w-full sm:w-auto">
                Shop Products
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-steel-200">
            <p className="text-sm text-steel-500">
              Need help?{' '}
              <Link 
                href="/contact" 
                className="text-performance-500 hover:text-performance-600 transition-colors"
              >
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 