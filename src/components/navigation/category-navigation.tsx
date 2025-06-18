'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SubCategory {
  name: string
  href: string
  description?: string
}

interface Category {
  name: string
  href: string
  subCategories?: SubCategory[]
  featured?: {
    name: string
    href: string
    imageSrc: string
    description: string
  }[]
}

const categories: Category[] = [
  {
    name: 'Shop All',
    href: '/products',
  },
  {
    name: 'Tops',
    href: '/categories/tops',
    subCategories: [
      { name: 'T-Shirts', href: '/categories/tops/t-shirts', description: 'Performance and casual tees' },
      { name: 'Tank Tops', href: '/categories/tops/tank-tops', description: 'Sleeveless athletic wear' },
      { name: 'Long Sleeves', href: '/categories/tops/long-sleeves', description: 'Long sleeve performance wear' },
      { name: 'Polos', href: '/categories/tops/polos', description: 'Athletic polo shirts' },
      { name: 'Sports Bras', href: '/categories/tops/sports-bras', description: 'Supportive athletic bras' },
    ],
    featured: [
      {
        name: 'New Performance Tees',
        href: '/collections/performance-tees',
        imageSrc: '/placeholder-collection.jpg',
        description: 'Latest moisture-wicking technology'
      }
    ]
  },
  {
    name: 'Bottoms',
    href: '/categories/bottoms',
    subCategories: [
      { name: 'Shorts', href: '/categories/bottoms/shorts', description: 'Athletic and training shorts' },
      { name: 'Leggings', href: '/categories/bottoms/leggings', description: 'Performance leggings and tights' },
      { name: 'Joggers', href: '/categories/bottoms/joggers', description: 'Comfortable athletic joggers' },
      { name: 'Track Pants', href: '/categories/bottoms/track-pants', description: 'Training track pants' },
      { name: 'Compression', href: '/categories/bottoms/compression', description: 'Compression wear' },
    ],
    featured: [
      {
        name: 'Premium Leggings',
        href: '/collections/premium-leggings',
        imageSrc: '/placeholder-collection.jpg',
        description: 'Ultra-comfortable high-performance leggings'
      }
    ]
  },
  {
    name: 'Outerwear',
    href: '/categories/outerwear',
    subCategories: [
      { name: 'Hoodies', href: '/categories/outerwear/hoodies', description: 'Athletic hoodies and sweatshirts' },
      { name: 'Jackets', href: '/categories/outerwear/jackets', description: 'Training and casual jackets' },
      { name: 'Vests', href: '/categories/outerwear/vests', description: 'Athletic vests and gilets' },
      { name: 'Windbreakers', href: '/categories/outerwear/windbreakers', description: 'Lightweight windbreakers' },
    ],
    featured: [
      {
        name: 'Winter Collection',
        href: '/collections/winter',
        imageSrc: '/placeholder-collection.jpg',
        description: 'Stay warm during winter workouts'
      }
    ]
  },
  {
    name: 'Accessories',
    href: '/categories/accessories',
    subCategories: [
      { name: 'Bags', href: '/categories/accessories/bags', description: 'Gym and sports bags' },
      { name: 'Hats', href: '/categories/accessories/hats', description: 'Athletic caps and beanies' },
      { name: 'Socks', href: '/categories/accessories/socks', description: 'Performance athletic socks' },
      { name: 'Gloves', href: '/categories/accessories/gloves', description: 'Training and workout gloves' },
      { name: 'Water Bottles', href: '/categories/accessories/water-bottles', description: 'Hydration accessories' },
    ],
    featured: [
      {
        name: 'Gym Essentials',
        href: '/collections/gym-essentials',
        imageSrc: '/placeholder-collection.jpg',
        description: 'Everything you need for your workout'
      }
    ]
  },
]

interface CategoryNavigationProps {
  variant?: 'header' | 'sidebar' | 'mobile'
  onLinkClick?: () => void
}

export function CategoryNavigation({ variant = 'header', onLinkClick }: CategoryNavigationProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const isActiveLink = (href: string) => {
    if (href === '/products' && pathname === '/products') return true
    if (href !== '/products' && pathname.startsWith(href)) return true
    return false
  }

  const handleCategoryClick = (categoryName: string, _categoryHref: string) => {
    if (variant === 'mobile') {
      if (openDropdown === categoryName) {
        setOpenDropdown(null)
      } else {
        setOpenDropdown(categoryName)
      }
    } else {
      // For desktop, navigate immediately
      onLinkClick?.()
    }
  }

  if (variant === 'mobile') {
    return (
      <div className="space-y-1">
        {categories.map((category) => (
          <div key={category.name}>
            {category.subCategories ? (
              <>
                <button
                  onClick={() => handleCategoryClick(category.name, category.href)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 text-left rounded-md transition-colors",
                    isActiveLink(category.href)
                      ? "bg-performance-50 text-performance-600 font-medium"
                      : "text-primary-900 hover:bg-steel-50"
                  )}
                >
                  <span>{category.name}</span>
                  <svg 
                    className={cn(
                      "h-4 w-4 transition-transform",
                      openDropdown === category.name ? "rotate-180" : ""
                    )}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Mobile Subcategories */}
                <div className={cn(
                  "transition-all duration-200 overflow-hidden",
                  openDropdown === category.name ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="ml-4 mt-1 space-y-1">
                    <Link
                      href={category.href as any}
                      onClick={onLinkClick}
                      className={cn(
                        "block px-3 py-2 text-sm rounded-md transition-colors",
                        isActiveLink(category.href)
                          ? "bg-performance-50 text-performance-600 font-medium"
                          : "text-steel-600 hover:bg-steel-50 hover:text-primary-900"
                      )}
                    >
                      View All {category.name}
                    </Link>
                    {category.subCategories.map((subCategory) => (
                      <Link
                        key={subCategory.name}
                        href={subCategory.href as any}
                        onClick={onLinkClick}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-md transition-colors",
                          isActiveLink(subCategory.href)
                            ? "bg-performance-50 text-performance-600 font-medium"
                            : "text-steel-600 hover:bg-steel-50 hover:text-primary-900"
                        )}
                      >
                        {subCategory.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <Link
                href={category.href as any}
                onClick={onLinkClick}
                className={cn(
                  "block px-3 py-2 rounded-md transition-colors font-medium",
                  isActiveLink(category.href)
                    ? "bg-performance-50 text-performance-600"
                    : "text-primary-900 hover:bg-steel-50"
                )}
              >
                {category.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Desktop/Header Navigation
  return (
    <div className="flex items-center space-x-8" ref={dropdownRef}>
      {categories.map((category) => (
        <div
          key={category.name}
          className="relative"
          onMouseEnter={() => category.subCategories && setHoveredCategory(category.name)}
          onMouseLeave={() => setHoveredCategory(null)}
        >
          <Link
            href={category.href as any}
            onClick={onLinkClick}
            className={cn(
              "text-primary-900 hover:text-performance-500 transition-colors duration-200 font-medium",
              isActiveLink(category.href) && "text-performance-500 font-semibold"
            )}
          >
            {category.name}
          </Link>

          {/* Desktop Mega Menu Dropdown */}
          {category.subCategories && hoveredCategory === category.name && (
            <div className="absolute top-full left-0 mt-2 w-screen max-w-4xl bg-white border border-steel-200 rounded-lg shadow-lg z-50 p-6">
              <div className="grid grid-cols-3 gap-8">
                {/* Subcategories */}
                <div className="col-span-2">
                  <h4 className="font-semibold text-athletic-black mb-4">{category.name} Categories</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {category.subCategories.map((subCategory) => (
                      <Link
                        key={subCategory.name}
                        href={subCategory.href as any}
                        onClick={onLinkClick}
                        className="group block p-3 rounded-md hover:bg-steel-50 transition-colors"
                      >
                        <h5 className="font-medium text-athletic-black group-hover:text-performance-500 transition-colors">
                          {subCategory.name}
                        </h5>
                        {subCategory.description && (
                          <p className="text-sm text-steel-600 mt-1">
                            {subCategory.description}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                  
                  {/* View All Link */}
                  <div className="mt-4 pt-4 border-t border-steel-100">
                    <Link
                      href={category.href as any}
                      onClick={onLinkClick}
                      className="inline-flex items-center text-performance-500 hover:text-performance-600 font-medium transition-colors"
                    >
                      View All {category.name}
                      <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* Featured Section */}
                {category.featured && (
                  <div>
                    <h4 className="font-semibold text-athletic-black mb-4">Featured</h4>
                    {category.featured.map((featured) => (
                      <Link
                        key={featured.name}
                        href={featured.href as any}
                        onClick={onLinkClick}
                        className="group block p-3 rounded-md hover:bg-steel-50 transition-colors"
                      >
                        <div className="aspect-video bg-steel-100 rounded-md mb-3 flex items-center justify-center">
                          <svg className="h-8 w-8 text-steel-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h5 className="font-medium text-athletic-black group-hover:text-performance-500 transition-colors">
                          {featured.name}
                        </h5>
                        <p className="text-sm text-steel-600 mt-1">
                          {featured.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 