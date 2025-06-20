import { Address } from './index'

// Order Status Types
export type OrderStatus = 
  | 'pending'
  | 'confirmed' 
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

// Payment Status Types
export type PaymentStatus = 
  | 'pending'
  | 'authorized'
  | 'captured'
  | 'failed'
  | 'refunded'
  | 'partially_refunded'

// Order Item Type
export interface OrderItem {
  id: string
  productId: string
  variantId?: string
  name: string
  image: string
  variant?: {
    size?: string
    color?: string
  }
  quantity: number
  unitPrice: number
  totalPrice: number
}

// Order Type
export interface Order {
  id: string
  orderNumber: string
  userId: string
  
  // Order Details
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  
  // Addresses
  shippingAddress: Address
  billingAddress?: Address
  
  // Shipping & Payment
  shippingMethod: {
    id: string
    name: string
    price: number
    estimatedDays: number
  }
  paymentMethod: {
    type: string
    last4?: string
    brand?: string
  }
  
  // Status & Dates
  status: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: string
  updatedAt: string
  estimatedDelivery?: string
  deliveredAt?: string
  
  // Additional Info
  promoCode?: string
  notes?: string
  trackingNumber?: string
}

// Order Input for Creation
export interface CreateOrderInput {
  items: Array<{
    productId: string
    variantId?: string
    quantity: number
    unitPrice: number
  }>
  shippingAddress: Omit<Address, 'id'>
  billingAddress?: Omit<Address, 'id'>
  shippingMethodId: string
  paymentMethodId: string
  promoCode?: string
  notes?: string
}

// Order Mutation Results
export interface CreateOrderResult {
  order: Order
  success: boolean
  message?: string
}

export interface UpdateOrderResult {
  order: Order
  success: boolean
  message?: string
}

// Order Filters for Queries
export interface OrderFilters {
  status?: OrderStatus[]
  paymentStatus?: PaymentStatus[]
  dateFrom?: string
  dateTo?: string
  search?: string
}

// Order List Response
export interface OrderListResponse {
  orders: Order[]
  totalCount: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

// Order Tracking Info
export interface OrderTracking {
  orderId: string
  trackingNumber?: string
  carrier?: string
  status: OrderStatus
  events: Array<{
    status: string
    description: string
    location?: string
    timestamp: string
  }>
  estimatedDelivery?: string
}

// Order Action Types
export interface OrderActions {
  cancel: boolean
  return: boolean
  reorder: boolean
  track: boolean
}

// Order Summary for Display
export interface OrderSummaryDisplay {
  id: string
  orderNumber: string
  total: number
  status: OrderStatus
  createdAt: string
  itemCount: number
  thumbnailImage?: string
} 