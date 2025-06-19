import { ApolloCache, gql } from '@apollo/client'
import {
  Product,
  ProductConnection,
  ProductCacheEntry,
  ProductListCache,
  PRODUCT_CACHE_TTL,
  PRODUCT_LIST_CACHE_TTL,
} from '@/types/product'

interface ProductCacheConfig {
  maxProducts: number
  maxLists: number
  productTTL: number
  listTTL: number
}

class ProductCacheManager {
  private static instance: ProductCacheManager
  private config: ProductCacheConfig
  private productCache: Map<string, ProductCacheEntry> = new Map()
  private listCache: ProductListCache = {}

  private constructor(config: Partial<ProductCacheConfig> = {}) {
    this.config = {
      maxProducts: 500,
      maxLists: 50,
      productTTL: PRODUCT_CACHE_TTL,
      listTTL: PRODUCT_LIST_CACHE_TTL,
      ...config,
    }
  }

  static getInstance(config?: Partial<ProductCacheConfig>): ProductCacheManager {
    if (!ProductCacheManager.instance) {
      ProductCacheManager.instance = new ProductCacheManager(config)
    }
    return ProductCacheManager.instance
  }

  // Product cache methods
  setProduct(product: Product): void {
    const now = new Date().toISOString()
    const expiresAt = new Date(Date.now() + this.config.productTTL).toISOString()

    const entry: ProductCacheEntry = {
      product,
      lastFetched: now,
      expiresAt,
    }

    this.productCache.set(product.id, entry)

    // Clean up if we exceed max size
    if (this.productCache.size > this.config.maxProducts) {
      this.cleanupProductCache()
    }
  }

  getProduct(id: string): Product | null {
    const entry = this.productCache.get(id)
    if (!entry) return null

    const now = Date.now()
    const expiresAt = new Date(entry.expiresAt).getTime()

    if (now > expiresAt) {
      this.productCache.delete(id)
      return null
    }

    return entry.product
  }

  hasProduct(id: string): boolean {
    return this.getProduct(id) !== null
  }

  removeProduct(id: string): void {
    this.productCache.delete(id)
  }

  // Product list cache methods
  setProductList(
    key: string,
    connection: ProductConnection,
    filters?: any,
    sort?: any
  ): void {
    const now = new Date().toISOString()
    const expiresAt = new Date(Date.now() + this.config.listTTL).toISOString()

    this.listCache[key] = {
      connection,
      lastFetched: now,
      expiresAt,
      filters,
      sort,
    }

    // Clean up if we exceed max size
    const keys = Object.keys(this.listCache)
    if (keys.length > this.config.maxLists) {
      this.cleanupListCache()
    }
  }

  getProductList(key: string): ProductConnection | null {
    const entry = this.listCache[key]
    if (!entry) return null

    const now = Date.now()
    const expiresAt = new Date(entry.expiresAt).getTime()

    if (now > expiresAt) {
      delete this.listCache[key]
      return null
    }

    return entry.connection
  }

  hasProductList(key: string): boolean {
    return this.getProductList(key) !== null
  }

  removeProductList(key: string): void {
    delete this.listCache[key]
  }

  // Cache cleanup methods
  private cleanupProductCache(): void {
    const entries = Array.from(this.productCache.entries())
    const now = Date.now()

    // Remove expired entries first
    entries.forEach(([id, entry]) => {
      const expiresAt = new Date(entry.expiresAt).getTime()
      if (now > expiresAt) {
        this.productCache.delete(id)
      }
    })

    // If still over limit, remove oldest entries
    if (this.productCache.size > this.config.maxProducts) {
      const sortedEntries = entries
        .filter(([id]) => this.productCache.has(id))
        .sort(([, a], [, b]) => {
          return new Date(a.lastFetched).getTime() - new Date(b.lastFetched).getTime()
        })

      const toRemove = this.productCache.size - this.config.maxProducts
      for (let i = 0; i < toRemove; i++) {
        const [id] = sortedEntries[i]
        this.productCache.delete(id)
      }
    }
  }

  private cleanupListCache(): void {
    const entries = Object.entries(this.listCache)
    const now = Date.now()

    // Remove expired entries first
    entries.forEach(([key, entry]) => {
      const expiresAt = new Date(entry.expiresAt).getTime()
      if (now > expiresAt) {
        delete this.listCache[key]
      }
    })

    // If still over limit, remove oldest entries
    const remainingEntries = Object.entries(this.listCache)
    if (remainingEntries.length > this.config.maxLists) {
      const sortedEntries = remainingEntries.sort(([, a], [, b]) => {
        return new Date(a.lastFetched).getTime() - new Date(b.lastFetched).getTime()
      })

      const toRemove = remainingEntries.length - this.config.maxLists
      for (let i = 0; i < toRemove; i++) {
        const [key] = sortedEntries[i]
        delete this.listCache[key]
      }
    }
  }

  // Utility methods
  clearAll(): void {
    this.productCache.clear()
    this.listCache = {}
  }

  getCacheStats(): {
    products: number
    lists: number
    maxProducts: number
    maxLists: number
  } {
    return {
      products: this.productCache.size,
      lists: Object.keys(this.listCache).length,
      maxProducts: this.config.maxProducts,
      maxLists: this.config.maxLists,
    }
  }

  // Generate cache keys for different query types
  static generateListCacheKey(
    queryType: string,
    variables: Record<string, any> = {}
  ): string {
    const sortedVars = Object.keys(variables)
      .sort()
      .map(key => `${key}:${JSON.stringify(variables[key])}`)
      .join('|')
    
    return `${queryType}:${sortedVars}`
  }

  // Invalidate related caches when a product is updated
  invalidateProductCaches(productId: string): void {
    // Remove the specific product
    this.removeProduct(productId)

    // Remove related product lists (this is aggressive but ensures consistency)
    // In a real application, you might want more granular invalidation
    const listsToRemove: string[] = []
    
    Object.entries(this.listCache).forEach(([key, entry]) => {
      // Check if this list might contain the updated product
      const hasProduct = entry.connection.edges.some(edge => edge.node.id === productId)
      if (hasProduct) {
        listsToRemove.push(key)
      }
    })

    listsToRemove.forEach(key => this.removeProductList(key))
  }

  // Update product in cache and related lists
  updateProduct(updatedProduct: Product): void {
    // Update in product cache
    this.setProduct(updatedProduct)

    // Update in list caches
    Object.entries(this.listCache).forEach(([key, entry]) => {
      const updatedEdges = entry.connection.edges.map(edge => {
        if (edge.node.id === updatedProduct.id) {
          return {
            ...edge,
            node: updatedProduct,
          }
        }
        return edge
      })

      if (updatedEdges !== entry.connection.edges) {
        this.listCache[key] = {
          ...entry,
          connection: {
            ...entry.connection,
            edges: updatedEdges,
          },
        }
      }
    })
  }
}

// Apollo Client cache configuration for products
export function createProductCacheConfig() {
  return {
    typePolicies: {
      Query: {
        fields: {
          products: {
            keyArgs: ['filters', 'sort', 'search'],
            merge(existing, incoming, { args }) {
              // Handle pagination merge
              if (args?.after) {
                // Append new edges to existing ones
                return {
                  ...incoming,
                  edges: [...(existing?.edges || []), ...incoming.edges],
                }
              }
              // Replace with new data
              return incoming
            },
          },
          productsByCategory: {
            keyArgs: ['categorySlug', 'filters', 'sort'],
            merge(existing, incoming, { args }) {
              if (args?.after) {
                return {
                  ...incoming,
                  edges: [...(existing?.edges || []), ...incoming.edges],
                }
              }
              return incoming
            },
          },
          productsByCollection: {
            keyArgs: ['collectionSlug', 'sort'],
            merge(existing, incoming, { args }) {
              if (args?.after) {
                return {
                  ...incoming,
                  edges: [...(existing?.edges || []), ...incoming.edges],
                }
              }
              return incoming
            },
          },
          searchProducts: {
            keyArgs: ['query', 'filters', 'sort'],
            merge(existing, incoming, { args }) {
              if (args?.after) {
                return {
                  ...incoming,
                  products: {
                    ...incoming.products,
                    edges: [
                      ...(existing?.products?.edges || []),
                      ...incoming.products.edges,
                    ],
                  },
                }
              }
              return incoming
            },
          },
          saleProducts: {
            keyArgs: ['sort'],
            merge(existing, incoming, { args }) {
              if (args?.after) {
                return {
                  ...incoming,
                  edges: [...(existing?.edges || []), ...incoming.edges],
                }
              }
              return incoming
            },
          },
        },
      },
      Product: {
        fields: {
          variants: {
            merge(existing, incoming) {
              return incoming
            },
          },
          images: {
            merge(existing, incoming) {
              return incoming
            },
          },
        },
      },
      ProductConnection: {
        fields: {
          edges: {
            merge(existing, incoming) {
              return incoming
            },
          },
        },
      },
    },
  }
}

// Cache utility functions
export function evictProductFromCache(cache: ApolloCache<any>, productId: string): void {
  cache.evict({
    id: cache.identify({ __typename: 'Product', id: productId }),
  })
  
  // Also evict any product lists that might contain this product
  cache.modify({
    fields: {
      products(existing) {
        return existing
      },
      productsByCategory(existing) {
        return existing
      },
      // Add other product list fields as needed
    },
  })
  
  cache.gc()
}

export function updateProductInCache(
  cache: ApolloCache<any>,
  updatedProduct: Product
): void {
  cache.writeFragment({
    id: cache.identify({ __typename: 'Product', id: updatedProduct.id }),
    fragment: gql`
      fragment UpdatedProduct on Product {
        id
        name
        price
        inStock
        # Add other fields that might have changed
      }
    `,
    data: updatedProduct,
  })
}

// Export singleton instance
export const productCacheManager = ProductCacheManager.getInstance()

// Cache key generators
export const CacheKeys = {
  products: (variables?: any) => ProductCacheManager.generateListCacheKey('products', variables),
  productsByCategory: (categorySlug: string, variables?: any) =>
    ProductCacheManager.generateListCacheKey('productsByCategory', { categorySlug, ...variables }),
  productsByCollection: (collectionSlug: string, variables?: any) =>
    ProductCacheManager.generateListCacheKey('productsByCollection', { collectionSlug, ...variables }),
  searchProducts: (query: string, variables?: any) =>
    ProductCacheManager.generateListCacheKey('searchProducts', { query, ...variables }),
  saleProducts: (variables?: any) => ProductCacheManager.generateListCacheKey('saleProducts', variables),
} 