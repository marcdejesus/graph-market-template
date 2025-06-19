// ESLint disabled for unused vars
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ProductFilters, ProductSortOptions } from '@/types/product'

interface UseProductFiltersReturn {
  filters: ProductFilters
  sortOptions: ProductSortOptions
  setFilter: (_key: keyof ProductFilters, _value: any) => void
  setSortOptions: (_sort: ProductSortOptions) => void
  clearFilters: () => void
  clearFilter: (_key: keyof ProductFilters) => void
  hasActiveFilters: boolean
  buildUrl: (_newFilters?: Partial<ProductFilters>, _newSort?: ProductSortOptions) => string
}

const DEFAULT_SORT: ProductSortOptions = {
  field: 'popularity',
  direction: 'desc'
}

export function useProductFilters(): UseProductFiltersReturn {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  const [filters, setFilters] = useState<ProductFilters>({})
  const [sortOptions, setSortOptionsState] = useState<ProductSortOptions>(DEFAULT_SORT)

  // Parse URL parameters into filters
  const parseFiltersFromUrl = useCallback(() => {
    const urlFilters: ProductFilters = {}
    
    // Category
    const categoryParam = searchParams.get('category')
    if (categoryParam) {
      urlFilters.category = categoryParam.split(',')
    }

    // Subcategory
    const subcategoryParam = searchParams.get('subcategory')
    if (subcategoryParam) {
      urlFilters.subcategory = subcategoryParam.split(',')
    }

    // Sizes
    const sizesParam = searchParams.get('sizes')
    if (sizesParam) {
      urlFilters.sizes = sizesParam.split(',')
    }

    // Colors
    const colorsParam = searchParams.get('colors')
    if (colorsParam) {
      urlFilters.colors = colorsParam.split(',')
    }

    // Brands
    const brandsParam = searchParams.get('brands')
    if (brandsParam) {
      urlFilters.brands = brandsParam.split(',')
    }

    // Price range
    const minPriceParam = searchParams.get('min_price')
    const maxPriceParam = searchParams.get('max_price')
    if (minPriceParam || maxPriceParam) {
      urlFilters.priceRange = {
        min: minPriceParam ? parseInt(minPriceParam, 10) : 0,
        max: maxPriceParam ? parseInt(maxPriceParam, 10) : 999999
      }
    }

    // Boolean filters
    const inStockParam = searchParams.get('in_stock')
    if (inStockParam === 'true') {
      urlFilters.inStock = true
    }

    const onSaleParam = searchParams.get('on_sale')
    if (onSaleParam === 'true') {
      urlFilters.onSale = true
    }

    // Rating
    const ratingParam = searchParams.get('rating')
    if (ratingParam) {
      const rating = parseInt(ratingParam, 10)
      if (!isNaN(rating)) {
        urlFilters.rating = rating
      }
    }

    // Tags
    const tagsParam = searchParams.get('tags')
    if (tagsParam) {
      urlFilters.tags = tagsParam.split(',')
    }

    return urlFilters
  }, [searchParams])

  // Parse sort options from URL
  const parseSortFromUrl = useCallback(() => {
    const sortField = searchParams.get('sort_field') as ProductSortOptions['field']
    const sortDirection = searchParams.get('sort_direction') as ProductSortOptions['direction']
    
    if (sortField && sortDirection && 
        ['name', 'price', 'rating', 'createdAt', 'popularity'].includes(sortField) &&
        ['asc', 'desc'].includes(sortDirection)) {
      return { field: sortField, direction: sortDirection }
    }
    
    return DEFAULT_SORT
  }, [searchParams])

  // Build URL with filters and sort
  const buildUrl = useCallback((
    newFilters?: Partial<ProductFilters>, 
    newSort?: ProductSortOptions
  ) => {
    const mergedFilters = { ...filters, ...newFilters }
    const mergedSort = newSort || sortOptions
    
    const params = new URLSearchParams()

    // Add filter params
    if (mergedFilters.category?.length) {
      params.set('category', mergedFilters.category.join(','))
    }
    
    if (mergedFilters.subcategory?.length) {
      params.set('subcategory', mergedFilters.subcategory.join(','))
    }
    
    if (mergedFilters.sizes?.length) {
      params.set('sizes', mergedFilters.sizes.join(','))
    }
    
    if (mergedFilters.colors?.length) {
      params.set('colors', mergedFilters.colors.join(','))
    }
    
    if (mergedFilters.brands?.length) {
      params.set('brands', mergedFilters.brands.join(','))
    }
    
    if (mergedFilters.priceRange) {
      if (mergedFilters.priceRange.min > 0) {
        params.set('min_price', mergedFilters.priceRange.min.toString())
      }
      if (mergedFilters.priceRange.max < 999999) {
        params.set('max_price', mergedFilters.priceRange.max.toString())
      }
    }
    
    if (mergedFilters.inStock) {
      params.set('in_stock', 'true')
    }
    
    if (mergedFilters.onSale) {
      params.set('on_sale', 'true')
    }
    
    if (mergedFilters.rating) {
      params.set('rating', mergedFilters.rating.toString())
    }
    
    if (mergedFilters.tags?.length) {
      params.set('tags', mergedFilters.tags.join(','))
    }

    // Add sort params
    if (mergedSort.field !== DEFAULT_SORT.field || mergedSort.direction !== DEFAULT_SORT.direction) {
      params.set('sort_field', mergedSort.field)
      params.set('sort_direction', mergedSort.direction)
    }

    const queryString = params.toString()
    return queryString ? `${pathname}?${queryString}` : pathname
  }, [filters, sortOptions, pathname])

  // Initialize from URL on mount
  useEffect(() => {
    const urlFilters = parseFiltersFromUrl()
    const urlSort = parseSortFromUrl()
    
    setFilters(urlFilters)
    setSortOptionsState(urlSort)
  }, [parseFiltersFromUrl, parseSortFromUrl])

  // Set a single filter
  const setFilter = useCallback((key: keyof ProductFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    const url = buildUrl({ [key]: value })
    router.push(url as any)
  }, [filters, buildUrl, router])

  // Set sort options
  const setSortOptions = useCallback((sort: ProductSortOptions) => {
    setSortOptionsState(sort)
    
    const url = buildUrl(undefined, sort)
    router.push(url as any)
  }, [buildUrl, router])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({})
    setSortOptionsState(DEFAULT_SORT)
    
    router.push(pathname as any)
  }, [router, pathname])

  // Clear a specific filter
  const clearFilter = useCallback((key: keyof ProductFilters) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    setFilters(newFilters)
    
    const url = buildUrl(newFilters)
    router.push(url as any)
  }, [filters, buildUrl, router])

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(value => {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== undefined)
    }
    return value !== undefined && value !== null
  })

  return {
    filters,
    sortOptions,
    setFilter,
    setSortOptions,
    clearFilters,
    clearFilter,
    hasActiveFilters,
    buildUrl
  }
} 