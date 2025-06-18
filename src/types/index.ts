// Core API types
export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
  errors?: string[]
}

// User and Authentication types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Product types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  category: ProductCategory
  images: ProductImage[]
  variants: ProductVariant[]
  inStock: boolean
  stock: number
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  url: string
  altText: string
  width: number
  height: number
  position: number
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  value: string
  type: 'size' | 'color'
  price?: number
  stock: number
  sku?: string
}

export type ProductCategory = 
  | 'tops'
  | 'bottoms'
  | 'outerwear'
  | 'accessories'
  | 'footwear'

// Cart types
export interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  imageUrl: string
  maxQuantity: number
  variantId?: string
}

export interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  lastUpdated: Date
}

// Order types
export interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  totalAmount: number
  status: OrderStatus
  shippingAddress: Address
  billingAddress?: Address
  paymentMethod?: PaymentMethod
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  trackingNumber?: string
}

export interface OrderItem {
  id: string
  productId: string
  variantId?: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  imageUrl: string
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

// Address types
export interface Address {
  id?: string
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province: string
  country: string
  zip: string
  phone?: string
}

// Payment types
export interface PaymentMethod {
  id: string
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay'
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
}

// Filter and search types
export interface ProductFilters {
  category?: ProductCategory[]
  priceRange?: { min: number; max: number }
  sizes?: string[]
  colors?: string[]
  inStock?: boolean
  tags?: string[]
  sortBy?: ProductSortOption
}

export type ProductSortOption = 
  | 'price_asc'
  | 'price_desc'
  | 'newest'
  | 'popular'
  | 'name_asc'
  | 'name_desc'

// Pagination types
export interface PaginationInfo {
  hasNextPage: boolean
  hasPreviousPage: boolean
  startCursor?: string
  endCursor?: string
}

export interface PageInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

// GraphQL types
export interface GraphQLEdge<T> {
  node: T
  cursor: string
}

export interface GraphQLConnection<T> {
  edges: GraphQLEdge<T>[]
  pageInfo: PaginationInfo
  totalCount: number
}

// Form types
export interface FormErrors {
  [key: string]: string | string[] | undefined
}

// UI Component types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'performance'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  error?: string
  onChange?: (_value: string) => void
}

// Navigation types
export interface NavItem {
  label: string
  href: string
  icon?: React.ComponentType
  children?: NavItem[]
  external?: boolean
}

// Theme types
export interface ThemeConfig {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
  }
  fonts: {
    body: string
    heading: string
  }
} 