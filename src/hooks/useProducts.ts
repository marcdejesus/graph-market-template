'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import {
  GET_PRODUCTS,
  GET_PRODUCT_BY_ID,
  GET_PRODUCT_BY_SLUG,
  GET_PRODUCTS_BY_CATEGORY,
  GET_PRODUCTS_BY_COLLECTION,
  SEARCH_PRODUCTS,
  GET_RELATED_PRODUCTS,
  GET_FEATURED_PRODUCTS,
  GET_NEW_ARRIVALS,
  GET_SALE_PRODUCTS,
  GET_CATEGORIES,
  GET_CATEGORY_BY_SLUG,
  GET_COLLECTIONS,
  GET_COLLECTION_BY_SLUG,
  GET_PRODUCT_FILTERS,
  GET_SEARCH_SUGGESTIONS,
  CHECK_PRODUCT_AVAILABILITY,
} from '@/lib/apollo/queries/products'
import {
  Product,
  ProductFilters,
  ProductSortOptions,
  ProductListVariables,
  ProductSearchResult,
  DEFAULT_PRODUCTS_PER_PAGE,
} from '@/types/product'

// Hook for fetching a list of products with pagination and filtering
export function useProducts(variables?: ProductListVariables) {
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_PRODUCTS, {
    variables: {
      first: DEFAULT_PRODUCTS_PER_PAGE,
      ...variables,
    },
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  })

  const products = useMemo(() => {
    return data?.products?.edges?.map((edge: any) => edge.node) || []
  }, [data])

  const pageInfo = useMemo(() => {
    return data?.products?.pageInfo
  }, [data])

  const totalCount = useMemo(() => {
    return data?.products?.totalCount || 0
  }, [data])

  const loadMore = useCallback(async () => {
    if (!pageInfo?.hasNextPage || loading) return

    try {
      await fetchMore({
        variables: {
          after: pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev

          return {
            products: {
              ...fetchMoreResult.products,
              edges: [
                ...prev.products.edges,
                ...fetchMoreResult.products.edges,
              ],
            },
          }
        },
      })
    } catch (err) {
      console.error('Error loading more products:', err)
    }
  }, [fetchMore, pageInfo, loading])

  const reload = useCallback(() => {
    refetch()
  }, [refetch])

  return {
    products,
    loading,
    error,
    pageInfo,
    totalCount,
    loadMore,
    reload,
  }
}

// Hook for fetching a single product by ID or slug
export function useProduct(id?: string, slug?: string) {
  const { data: productById, loading: loadingById, error: errorById } = useQuery(
    GET_PRODUCT_BY_ID,
    {
      variables: { id },
      skip: !id,
      errorPolicy: 'all',
    }
  )

  const { data: productBySlug, loading: loadingBySlug, error: errorBySlug } = useQuery(
    GET_PRODUCT_BY_SLUG,
    {
      variables: { slug },
      skip: !slug,
      errorPolicy: 'all',
    }
  )

  const product = useMemo(() => {
    return productById?.product || productBySlug?.productBySlug
  }, [productById, productBySlug])

  const loading = loadingById || loadingBySlug
  const error = errorById || errorBySlug

  return {
    product,
    loading,
    error,
  }
}

// Hook for fetching products by category
export function useProductsByCategory(
  categorySlug: string,
  variables?: Omit<ProductListVariables, 'filters'> & { filters?: Omit<ProductFilters, 'category'> }
) {
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_PRODUCTS_BY_CATEGORY, {
    variables: {
      categorySlug,
      first: DEFAULT_PRODUCTS_PER_PAGE,
      ...variables,
    },
    skip: !categorySlug,
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  })

  const products = useMemo(() => {
    return data?.productsByCategory?.edges?.map((edge: any) => edge.node) || []
  }, [data])

  const pageInfo = useMemo(() => {
    return data?.productsByCategory?.pageInfo
  }, [data])

  const totalCount = useMemo(() => {
    return data?.productsByCategory?.totalCount || 0
  }, [data])

  const loadMore = useCallback(async () => {
    if (!pageInfo?.hasNextPage || loading) return

    try {
      await fetchMore({
        variables: {
          after: pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev

          return {
            productsByCategory: {
              ...fetchMoreResult.productsByCategory,
              edges: [
                ...prev.productsByCategory.edges,
                ...fetchMoreResult.productsByCategory.edges,
              ],
            },
          }
        },
      })
    } catch (err) {
      console.error('Error loading more products:', err)
    }
  }, [fetchMore, pageInfo, loading])

  return {
    products,
    loading,
    error,
    pageInfo,
    totalCount,
    loadMore,
    refetch,
  }
}

// Hook for fetching products by collection
export function useProductsByCollection(
  collectionSlug: string,
  variables?: Omit<ProductListVariables, 'filters'>
) {
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_PRODUCTS_BY_COLLECTION, {
    variables: {
      collectionSlug,
      first: DEFAULT_PRODUCTS_PER_PAGE,
      ...variables,
    },
    skip: !collectionSlug,
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  })

  const products = useMemo(() => {
    return data?.productsByCollection?.edges?.map((edge: any) => edge.node) || []
  }, [data])

  const pageInfo = useMemo(() => {
    return data?.productsByCollection?.pageInfo
  }, [data])

  const totalCount = useMemo(() => {
    return data?.productsByCollection?.totalCount || 0
  }, [data])

  const loadMore = useCallback(async () => {
    if (!pageInfo?.hasNextPage || loading) return

    try {
      await fetchMore({
        variables: {
          after: pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev

          return {
            productsByCollection: {
              ...fetchMoreResult.productsByCollection,
              edges: [
                ...prev.productsByCollection.edges,
                ...fetchMoreResult.productsByCollection.edges,
              ],
            },
          }
        },
      })
    } catch (err) {
      console.error('Error loading more products:', err)
    }
  }, [fetchMore, pageInfo, loading])

  return {
    products,
    loading,
    error,
    pageInfo,
    totalCount,
    loadMore,
    refetch,
  }
}

// Hook for product search with filters and facets
export function useProductSearch() {
  const [searchQuery, { data, loading, error }] = useLazyQuery(SEARCH_PRODUCTS, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  })

  const [searchState, setSearchState] = useState<{
    query: string
    filters?: ProductFilters
    sort?: ProductSortOptions
    results?: ProductSearchResult
  }>({
    query: '',
  })

  const search = useCallback(
    async (
      query: string,
      filters?: ProductFilters,
      sort?: ProductSortOptions
    ) => {
      setSearchState({ query, filters, sort })

      try {
        await searchQuery({
          variables: {
            query,
            first: DEFAULT_PRODUCTS_PER_PAGE,
            filters,
            sort,
          },
        })
      } catch (err) {
        console.error('Error searching products:', err)
      }
    },
    [searchQuery]
  )

  const results = useMemo(() => {
    return data?.searchProducts
  }, [data])

  const products = useMemo(() => {
    return results?.products?.edges?.map((edge: any) => edge.node) || []
  }, [results])

  const filters = useMemo(() => {
    return results?.filters
  }, [results])

  const suggestions = useMemo(() => {
    return results?.suggestions || []
  }, [results])

  const totalResults = useMemo(() => {
    return results?.totalResults || 0
  }, [results])

  return {
    search,
    products,
    filters,
    suggestions,
    totalResults,
    loading,
    error,
    searchQuery: searchState.query,
  }
}

// Hook for getting related products
export function useRelatedProducts(
  productId: string,
  options?: {
    categoryId?: string
    limit?: number
    excludeIds?: string[]
  }
) {
  const { data, loading, error } = useQuery(GET_RELATED_PRODUCTS, {
    variables: {
      productId,
      limit: 4,
      ...options,
    },
    skip: !productId,
    errorPolicy: 'all',
  })

  const products = useMemo(() => {
    return data?.relatedProducts || []
  }, [data])

  return {
    products,
    loading,
    error,
  }
}

// Hook for featured products
export function useFeaturedProducts(limit = 8) {
  const { data, loading, error, refetch } = useQuery(GET_FEATURED_PRODUCTS, {
    variables: { limit },
    errorPolicy: 'all',
  })

  const products = useMemo(() => {
    return data?.featuredProducts || []
  }, [data])

  return {
    products,
    loading,
    error,
    refetch,
  }
}

// Hook for new arrivals
export function useNewArrivals(limit = 8) {
  const { data, loading, error, refetch } = useQuery(GET_NEW_ARRIVALS, {
    variables: { limit },
    errorPolicy: 'all',
  })

  const products = useMemo(() => {
    return data?.newArrivals || []
  }, [data])

  return {
    products,
    loading,
    error,
    refetch,
  }
}

// Hook for sale products
export function useSaleProducts(variables?: ProductListVariables) {
  const { data, loading, error, fetchMore, refetch } = useQuery(GET_SALE_PRODUCTS, {
    variables: {
      first: DEFAULT_PRODUCTS_PER_PAGE,
      ...variables,
    },
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  })

  const products = useMemo(() => {
    return data?.saleProducts?.edges?.map((edge: any) => edge.node) || []
  }, [data])

  const pageInfo = useMemo(() => {
    return data?.saleProducts?.pageInfo
  }, [data])

  const totalCount = useMemo(() => {
    return data?.saleProducts?.totalCount || 0
  }, [data])

  const loadMore = useCallback(async () => {
    if (!pageInfo?.hasNextPage || loading) return

    try {
      await fetchMore({
        variables: {
          after: pageInfo.endCursor,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev

          return {
            saleProducts: {
              ...fetchMoreResult.saleProducts,
              edges: [
                ...prev.saleProducts.edges,
                ...fetchMoreResult.saleProducts.edges,
              ],
            },
          }
        },
      })
    } catch (err) {
      console.error('Error loading more sale products:', err)
    }
  }, [fetchMore, pageInfo, loading])

  return {
    products,
    loading,
    error,
    pageInfo,
    totalCount,
    loadMore,
    refetch,
  }
}

// Hook for categories
export function useCategories() {
  const { data, loading, error, refetch } = useQuery(GET_CATEGORIES, {
    errorPolicy: 'all',
  })

  const categories = useMemo(() => {
    return data?.categories || []
  }, [data])

  return {
    categories,
    loading,
    error,
    refetch,
  }
}

// Hook for single category
export function useCategory(slug: string) {
  const { data, loading, error } = useQuery(GET_CATEGORY_BY_SLUG, {
    variables: { slug },
    skip: !slug,
    errorPolicy: 'all',
  })

  const category = useMemo(() => {
    return data?.categoryBySlug
  }, [data])

  return {
    category,
    loading,
    error,
  }
}

// Hook for collections
export function useCollections() {
  const { data, loading, error, refetch } = useQuery(GET_COLLECTIONS, {
    errorPolicy: 'all',
  })

  const collections = useMemo(() => {
    return data?.collections || []
  }, [data])

  return {
    collections,
    loading,
    error,
    refetch,
  }
}

// Hook for single collection
export function useCollection(slug: string) {
  const { data, loading, error } = useQuery(GET_COLLECTION_BY_SLUG, {
    variables: { slug },
    skip: !slug,
    errorPolicy: 'all',
  })

  const collection = useMemo(() => {
    return data?.collectionBySlug
  }, [data])

  return {
    collection,
    loading,
    error,
  }
}

// Hook for product filters/facets
export function useProductFilters(categorySlug?: string, search?: string) {
  const { data, loading, error } = useQuery(GET_PRODUCT_FILTERS, {
    variables: { categorySlug, search },
    errorPolicy: 'all',
  })

  const filters = useMemo(() => {
    return data?.productFilters
  }, [data])

  return {
    filters,
    loading,
    error,
  }
}

// Hook for search suggestions
export function useSearchSuggestions() {
  const [getSuggestions, { data, loading, error }] = useLazyQuery(GET_SEARCH_SUGGESTIONS, {
    errorPolicy: 'all',
  })

  const suggestions = useMemo(() => {
    return data?.searchSuggestions || []
  }, [data])

  const search = useCallback(
    (query: string, limit = 5) => {
      if (query.length >= 2) {
        getSuggestions({
          variables: { query, limit },
        })
      }
    },
    [getSuggestions]
  )

  return {
    suggestions,
    search,
    loading,
    error,
  }
}

// Hook for checking product availability
export function useProductAvailability(productId?: string, variantId?: string) {
  const { data, loading, error, refetch } = useQuery(CHECK_PRODUCT_AVAILABILITY, {
    variables: { productId, variantId },
    skip: !productId,
    errorPolicy: 'all',
    pollInterval: 30000, // Poll every 30 seconds for availability updates
  })

  const availability = useMemo(() => {
    return data?.productAvailability
  }, [data])

  return {
    availability,
    loading,
    error,
    refetch,
  }
}

// Hook for managing recently viewed products (client-side)
export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([])

  useEffect(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem('fitmarket:recently-viewed')
      if (stored) {
        const parsed = JSON.parse(stored)
        setRecentlyViewed(parsed)
      }
    } catch (err) {
      console.error('Error loading recently viewed products:', err)
    }
  }, [])

  const addProduct = useCallback((product: Product) => {
    setRecentlyViewed(prev => {
      // Remove if already exists, then add to beginning
      const filtered = prev.filter(p => p.id !== product.id)
      const updated = [product, ...filtered].slice(0, 10) // Keep max 10 items

      // Save to localStorage
      try {
        localStorage.setItem('fitmarket:recently-viewed', JSON.stringify(updated))
      } catch (err) {
        console.error('Error saving recently viewed products:', err)
      }

      return updated
    })
  }, [])

  const clearAll = useCallback(() => {
    setRecentlyViewed([])
    try {
      localStorage.removeItem('fitmarket:recently-viewed')
    } catch (err) {
      console.error('Error clearing recently viewed products:', err)
    }
  }, [])

  return {
    recentlyViewed,
    addProduct,
    clearAll,
  }
}

// Hook for managing product comparison (client-side)
export function useProductComparison() {
  const [comparisonProducts, setComparisonProducts] = useState<Product[]>([])

  useEffect(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem('fitmarket:comparison')
      if (stored) {
        const parsed = JSON.parse(stored)
        setComparisonProducts(parsed)
      }
    } catch (err) {
      console.error('Error loading comparison products:', err)
    }
  }, [])

  const addProduct = useCallback((product: Product) => {
    setComparisonProducts(prev => {
      if (prev.find(p => p.id === product.id)) {
        return prev // Already in comparison
      }

      const updated = [...prev, product].slice(0, 4) // Max 4 products for comparison

      // Save to localStorage
      try {
        localStorage.setItem('fitmarket:comparison', JSON.stringify(updated))
      } catch (err) {
        console.error('Error saving comparison products:', err)
      }

      return updated
    })
  }, [])

  const removeProduct = useCallback((productId: string) => {
    setComparisonProducts(prev => {
      const updated = prev.filter(p => p.id !== productId)

      // Save to localStorage
      try {
        localStorage.setItem('fitmarket:comparison', JSON.stringify(updated))
      } catch (err) {
        console.error('Error saving comparison products:', err)
      }

      return updated
    })
  }, [])

  const clearAll = useCallback(() => {
    setComparisonProducts([])
    try {
      localStorage.removeItem('fitmarket:comparison')
    } catch (err) {
      console.error('Error clearing comparison products:', err)
    }
  }, [])

  const isInComparison = useCallback(
    (productId: string) => {
      return comparisonProducts.some(p => p.id === productId)
    },
    [comparisonProducts]
  )

  return {
    comparisonProducts,
    addProduct,
    removeProduct,
    clearAll,
    isInComparison,
    canAddMore: comparisonProducts.length < 4,
  }
} 