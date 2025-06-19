// Core product interfaces for the FitMarket e-commerce platform

export interface Product {
  id: string
  name: string
  description: string
  shortDescription?: string
  slug: string
  sku: string
  
  // Pricing
  price: number
  originalPrice?: number // For sale pricing
  isOnSale: boolean
  salePercentage?: number
  
  // Categories and classification
  category: ProductCategory
  subcategory?: ProductSubcategory
  tags: string[]
  brand: string
  
  // Inventory and variants
  inStock: boolean
  stockQuantity: number
  variants: ProductVariant[]
  
  // Media
  images: ProductImage[]
  featuredImage: ProductImage
  
  // Metadata
  isActive: boolean
  isFeatured: boolean
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
  
  // SEO
  metaTitle?: string
  metaDescription?: string
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  
  // Variant attributes
  size?: ProductSize
  color?: ProductColor
  
  // Pricing (can override product price)
  price?: number
  originalPrice?: number
  
  // Inventory
  inStock: boolean
  stockQuantity: number
  
  // Media (variant-specific images)
  images?: ProductImage[]
  
  // Physical attributes
  weight?: number
  dimensions?: ProductDimensions
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  width: number
  height: number
  isMain: boolean
  sortOrder: number
  
  // Image variants for responsive display
  thumbnailUrl: string
  mediumUrl: string
  largeUrl: string
}

export interface ProductSize {
  id: string
  name: string // 'XS', 'S', 'M', 'L', 'XL', 'XXL'
  label: string // 'Extra Small', 'Small', etc.
  sortOrder: number
  measurements?: SizeMeasurements
}

export interface SizeMeasurements {
  chest?: number
  waist?: number
  hips?: number
  length?: number
  inseam?: number
  // Measurements in inches
}

export interface ProductColor {
  id: string
  name: string // 'athletic-black', 'performance-red'
  label: string // 'Athletic Black', 'Performance Red'
  hexCode: string // '#1A1A1A', '#DC2626'
  imageUrl?: string // Color swatch image
  sortOrder: number
}

export interface ProductDimensions {
  length: number
  width: number
  height: number
  unit: 'in' | 'cm'
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  isActive: boolean
  sortOrder: number
  parentId?: string // For nested categories
}

export interface ProductSubcategory {
  id: string
  name: string
  slug: string
  description?: string
  categoryId: string
  category: ProductCategory
  isActive: boolean
  sortOrder: number
}

// Collection interfaces for featured groupings
export interface ProductCollection {
  id: string
  name: string
  slug: string
  description: string
  imageUrl?: string
  isActive: boolean
  isFeatured: boolean
  products: Product[]
  productCount: number
  sortOrder: number
  createdAt: string
}

// Filter and search interfaces
export interface ProductFilters {
  category?: string[]
  subcategory?: string[]
  sizes?: string[]
  colors?: string[]
  brands?: string[]
  priceRange?: {
    min: number
    max: number
  }
  inStock?: boolean
  onSale?: boolean
  rating?: number // Minimum rating
  tags?: string[]
}

export interface ProductSortOptions {
  field: 'name' | 'price' | 'rating' | 'createdAt' | 'popularity'
  direction: 'asc' | 'desc'
}

// Pagination interfaces
export interface ProductConnection {
  edges: ProductEdge[]
  pageInfo: PageInfo
  totalCount: number
}

export interface ProductEdge {
  node: Product
  cursor: string
}

export interface PageInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor: string | null
  endCursor: string | null
}

// Search and discovery interfaces
export interface ProductSearchResult {
  products: ProductConnection
  filters: AvailableFilters
  suggestions?: SearchSuggestion[]
  totalResults: number
  searchTime: number
}

export interface AvailableFilters {
  categories: FilterOption[]
  subcategories: FilterOption[]
  brands: FilterOption[]
  sizes: FilterOption[]
  colors: FilterOption[]
  priceRange: {
    min: number
    max: number
  }
}

export interface FilterOption {
  value: string
  label: string
  count: number
  isActive?: boolean
}

export interface SearchSuggestion {
  type: 'product' | 'category' | 'brand'
  value: string
  label: string
  count?: number
}

// Product list query variables
export interface ProductListVariables {
  first?: number
  after?: string
  last?: number
  before?: string
  filters?: ProductFilters
  sort?: ProductSortOptions
  search?: string
}

// Individual product query variables
export interface ProductDetailVariables {
  id?: string
  slug?: string
}

// Related products variables
export interface RelatedProductsVariables {
  productId: string
  categoryId?: string
  limit?: number
  excludeIds?: string[]
}

// Product review interfaces (for future implementation)
export interface ProductReview {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  title: string
  content: string
  isVerifiedPurchase: boolean
  helpfulCount: number
  createdAt: string
  updatedAt: string
}

export interface ProductReviewSummary {
  productId: string
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    [key: number]: number // rating -> count
  }
}

// Wishlist/favorites interfaces
export interface WishlistItem {
  id: string
  productId: string
  product: Product
  userId: string
  createdAt: string
}

// Recently viewed products
export interface RecentlyViewedProduct {
  productId: string
  product: Product
  viewedAt: string
}

// Product comparison interface
export interface ProductComparison {
  products: Product[]
  attributes: ComparisonAttribute[]
}

export interface ComparisonAttribute {
  key: string
  label: string
  type: 'text' | 'number' | 'boolean' | 'rating'
  values: { [productId: string]: any }
}

// Cache and state management types
export interface ProductCacheEntry {
  product: Product
  lastFetched: string
  expiresAt: string
}

export interface ProductListCache {
  [key: string]: {
    connection: ProductConnection
    lastFetched: string
    expiresAt: string
    filters?: ProductFilters
    sort?: ProductSortOptions
  }
}

// Error interfaces
export interface ProductError {
  code: string
  message: string
  field?: string
}

export interface ProductOperationResult<T> {
  data?: T
  error?: ProductError
  loading: boolean
}

// Utility types
export type ProductSortField = ProductSortOptions['field']
export type ProductSortDirection = ProductSortOptions['direction']
export type ProductFilterKey = keyof ProductFilters
export type ProductStatus = 'active' | 'inactive' | 'discontinued'

// Constants for default values
export const DEFAULT_PRODUCTS_PER_PAGE = 20
export const MAX_PRODUCTS_PER_PAGE = 100
export const PRODUCT_CACHE_TTL = 5 * 60 * 1000 // 5 minutes
export const PRODUCT_LIST_CACHE_TTL = 2 * 60 * 1000 // 2 minutes

export const PRODUCT_SORT_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'popularity_desc', label: 'Most Popular' },
  { value: 'createdAt_desc', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating_desc', label: 'Highest Rated' },
  { value: 'name_asc', label: 'Name: A to Z' },
] 