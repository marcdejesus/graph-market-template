'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href: string
  current?: boolean
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  const pathname = usePathname()

  // Auto-generate breadcrumb items from pathname if not provided
  const breadcrumbItems = items || generateBreadcrumbItems(pathname)

  if (breadcrumbItems.length <= 1) {
    return null // Don't show breadcrumb for home page or single-level pages
  }

  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          
          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <svg
                  className="mx-2 h-4 w-4 text-steel-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              
              {isLast || item.current ? (
                <span
                  className="text-athletic-black font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href as any}
                  className="text-steel-600 hover:text-performance-500 transition-colors duration-200"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Auto-generate breadcrumb items from pathname
function generateBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const items: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ]

  let currentPath = ''
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`
    const isLast = index === segments.length - 1
    
    // Convert segment to readable label
    const label = formatSegmentLabel(segment, segments, index)
    
    items.push({
      label,
      href: currentPath,
      current: isLast
    })
  })

  return items
}

// Format URL segments into readable labels
function formatSegmentLabel(segment: string, allSegments: string[], index: number): string {
  // Handle specific routes
  const routeMap: Record<string, string> = {
    'products': 'Products',
    'categories': 'Categories',
    'search': 'Search Results',
    'profile': 'My Profile',
    'orders': 'My Orders',
    'auth': 'Account',
    'login': 'Sign In',
    'register': 'Sign Up',
    'forgot-password': 'Reset Password',
    'cart': 'Shopping Cart',
    'checkout': 'Checkout',
    'collections': 'Collections',
    // Category specific
    'tops': 'Tops',
    'bottoms': 'Bottoms',
    'outerwear': 'Outerwear',
    'accessories': 'Accessories',
    'footwear': 'Footwear',
    // Subcategories
    't-shirts': 'T-Shirts',
    'tank-tops': 'Tank Tops',
    'long-sleeves': 'Long Sleeves',
    'polos': 'Polos',
    'sports-bras': 'Sports Bras',
    'shorts': 'Shorts',
    'leggings': 'Leggings',
    'joggers': 'Joggers',
    'track-pants': 'Track Pants',
    'compression': 'Compression',
    'hoodies': 'Hoodies',
    'jackets': 'Jackets',
    'vests': 'Vests',
    'windbreakers': 'Windbreakers',
    'bags': 'Bags',
    'hats': 'Hats',
    'socks': 'Socks',
    'gloves': 'Gloves',
    'water-bottles': 'Water Bottles'
  }

  // Check if it's a mapped route
  if (routeMap[segment]) {
    return routeMap[segment]
  }

  // Handle dynamic routes (e.g., product IDs, order IDs)
  if (segment.match(/^[a-f0-9-]{36}$/i) || segment.match(/^\d+$/)) {
    // UUID or numeric ID - determine context from previous segment
    const prevSegment = allSegments[index - 1]
    if (prevSegment === 'products') return 'Product Details'
    if (prevSegment === 'orders') return 'Order Details'
    if (prevSegment === 'categories') return 'Category'
    return 'Details'
  }

  // Handle search queries
  if (allSegments[index - 1] === 'search' && segment.startsWith('q=')) {
    const query = decodeURIComponent(segment.replace('q=', ''))
    return `"${query}"`
  }

  // Default: capitalize and replace hyphens with spaces
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Component for mobile breadcrumb with simplified view
export function MobileBreadcrumb({ items, className }: BreadcrumbProps) {
  const pathname = usePathname()
  const breadcrumbItems = items || generateBreadcrumbItems(pathname)

  if (breadcrumbItems.length <= 1) {
    return null
  }

  // Show only current and parent for mobile
  const currentItem = breadcrumbItems[breadcrumbItems.length - 1]
  const parentItem = breadcrumbItems.length > 2 ? breadcrumbItems[breadcrumbItems.length - 2] : breadcrumbItems[0]

  if (!currentItem || !parentItem) {
    return null
  }

  return (
    <nav className={cn("flex md:hidden", className)} aria-label="Breadcrumb">
      <div className="flex items-center space-x-2 text-sm">
        <Link
          href={parentItem.href as any}
          className="text-steel-600 hover:text-performance-500 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <span className="text-athletic-black font-medium">
          {currentItem.label}
        </span>
      </div>
    </nav>
  )
}

// Wrapper component that shows desktop breadcrumb on larger screens and mobile on smaller
export function ResponsiveBreadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <div className={className}>
      {/* Desktop Breadcrumb */}
      <div className="hidden md:block">
        <Breadcrumb items={items} />
      </div>
      
      {/* Mobile Breadcrumb */}
      <MobileBreadcrumb items={items} />
    </div>
  )
} 