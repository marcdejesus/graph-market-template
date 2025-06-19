import {  AvailableFilters } from '@/types/product'

// Mock available filter options
export const mockAvailableFilters: AvailableFilters = {
  categories: [
    { value: 'tops', label: 'Tops', count: 45 },
    { value: 'bottoms', label: 'Bottoms', count: 32 },
    { value: 'outerwear', label: 'Outerwear', count: 18 },
    { value: 'accessories', label: 'Accessories', count: 24 },
  ],
  subcategories: [
    { value: 't-shirts', label: 'T-Shirts', count: 28 },
    { value: 'tank-tops', label: 'Tank Tops', count: 17 },
    { value: 'leggings', label: 'Leggings', count: 22 },
    { value: 'shorts', label: 'Shorts', count: 10 },
    { value: 'jackets', label: 'Jackets', count: 12 },
    { value: 'hoodies', label: 'Hoodies', count: 6 },
    { value: 'bags', label: 'Bags', count: 15 },
    { value: 'accessories', label: 'Other Accessories', count: 9 },
  ],
  brands: [
    { value: 'fitmarket', label: 'FitMarket', count: 89 },
    { value: 'athletic-pro', label: 'Athletic Pro', count: 34 },
    { value: 'performance-gear', label: 'Performance Gear', count: 27 },
    { value: 'sport-elite', label: 'Sport Elite', count: 23 },
  ],
  sizes: [
    { value: 'xs', label: 'XS', count: 68 },
    { value: 's', label: 'S', count: 89 },
    { value: 'm', label: 'M', count: 95 },
    { value: 'l', label: 'L', count: 87 },
    { value: 'xl', label: 'XL', count: 74 },
    { value: 'xxl', label: 'XXL', count: 45 },
  ],
  colors: [
    { value: 'athletic-black', label: 'Athletic Black', count: 45 },
    { value: 'performance-red', label: 'Performance Red', count: 32 },
    { value: 'steel-gray', label: 'Steel Gray', count: 28 },
    { value: 'energy-orange', label: 'Energy Orange', count: 18 },
    { value: 'white', label: 'White', count: 41 },
    { value: 'navy', label: 'Navy', count: 24 },
    { value: 'forest-green', label: 'Forest Green', count: 15 },
    { value: 'royal-blue', label: 'Royal Blue', count: 19 },
  ],
  priceRange: {
    min: 15,
    max: 180
  }
}

// Helper function to get available filters by category
export function getAvailableFiltersByCategory(categorySlug?: string): AvailableFilters {
  if (!categorySlug) {
    return mockAvailableFilters
  }

  // Filter subcategories and adjust counts based on category
  const categoryBasedFilters = { ...mockAvailableFilters }

  switch (categorySlug) {
    case 'tops':
      categoryBasedFilters.subcategories = mockAvailableFilters.subcategories.filter(
        sub => ['t-shirts', 'tank-tops'].includes(sub.value)
      )
      categoryBasedFilters.priceRange = { min: 15, max: 85 }
      break
    
    case 'bottoms':
      categoryBasedFilters.subcategories = mockAvailableFilters.subcategories.filter(
        sub => ['leggings', 'shorts'].includes(sub.value)
      )
      categoryBasedFilters.priceRange = { min: 25, max: 120 }
      break
    
    case 'outerwear':
      categoryBasedFilters.subcategories = mockAvailableFilters.subcategories.filter(
        sub => ['jackets', 'hoodies'].includes(sub.value)
      )
      categoryBasedFilters.priceRange = { min: 45, max: 180 }
      break
    
    case 'accessories':
      categoryBasedFilters.subcategories = mockAvailableFilters.subcategories.filter(
        sub => ['bags', 'accessories'].includes(sub.value)
      )
      categoryBasedFilters.priceRange = { min: 15, max: 95 }
      // Remove size filters for accessories
      categoryBasedFilters.sizes = []
      break
  }

  return categoryBasedFilters
}

// Helper function to filter products based on applied filters
export function filterProducts<T extends { 
  category: { slug: string }
  price: number
  inStock: boolean
  isOnSale: boolean
  brand: string
  tags: string[]
}>(products: T[], filters: any): T[] {
  return products.filter(product => {
    // Category filter
    if (filters.category?.length && !filters.category.includes(product.category.slug)) {
      return false
    }

    // Price range filter
    if (filters.priceRange) {
      if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
        return false
      }
    }

    // Stock filter
    if (filters.inStock && !product.inStock) {
      return false
    }

    // Sale filter
    if (filters.onSale && !product.isOnSale) {
      return false
    }

    // Brand filter
    if (filters.brands?.length && !filters.brands.includes(product.brand)) {
      return false
    }

    // Tags filter
    if (filters.tags?.length) {
      const hasMatchingTag = filters.tags.some((tag: string) => product.tags.includes(tag))
      if (!hasMatchingTag) {
        return false
      }
    }

    return true
  })
}

// Helper function to sort products
export function sortProducts<T extends {
  name: string
  price: number
  rating: number
  createdAt: string
}>(products: T[], sortOptions: { field: string; direction: string }): T[] {
  const sorted = [...products]

  sorted.sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortOptions.field) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'price':
        aValue = a.price
        bValue = b.price
        break
      case 'rating':
        aValue = a.rating
        bValue = b.rating
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      case 'popularity':
        // Mock popularity as rating * random factor
        aValue = a.rating * Math.random()
        bValue = b.rating * Math.random()
        break
      default:
        return 0
    }

    if (aValue < bValue) {
      return sortOptions.direction === 'asc' ? -1 : 1
    }
    if (aValue > bValue) {
      return sortOptions.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  return sorted
} 