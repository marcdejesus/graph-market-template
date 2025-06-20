import { Address, CartItem } from './index'

// Checkout Step Types
export type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation'

export interface CheckoutStepInfo {
  id: CheckoutStep
  title: string
  description: string
  isCompleted: boolean
  isActive: boolean
  isAccessible: boolean
}

// Shipping Information
export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: number
  isDefault?: boolean
}

export interface ShippingInfo {
  address: Address
  method: ShippingMethod
  instructions?: string
}

// Payment Information
export interface PaymentInfo {
  type: 'card' | 'paypal' | 'apple_pay' | 'google_pay'
  cardNumber?: string
  expiryMonth?: number
  expiryYear?: number
  cvv?: string
  cardholderName?: string
  billingAddress?: Address
  saveCard?: boolean
}

// Order Summary
export interface OrderSummary {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  promoCode?: string
  estimatedDelivery: Date
}

// Checkout State
export interface CheckoutState {
  currentStep: CheckoutStep
  steps: CheckoutStepInfo[]
  shippingInfo?: ShippingInfo
  paymentInfo?: PaymentInfo
  orderSummary: OrderSummary
  isLoading: boolean
  error: string | null
  validationErrors: Record<string, string[]>
}

// Form Validation
export interface CheckoutFormErrors {
  shipping?: {
    address?: Record<string, string>
    method?: string
  }
  payment?: {
    card?: Record<string, string>
    billing?: Record<string, string>
  }
}

// Checkout Actions
export type CheckoutAction = 
  | { type: 'SET_CURRENT_STEP'; payload: CheckoutStep }
  | { type: 'UPDATE_STEP_STATUS'; payload: { step: CheckoutStep; isCompleted: boolean; isAccessible: boolean } }
  | { type: 'SET_SHIPPING_INFO'; payload: ShippingInfo }
  | { type: 'SET_PAYMENT_INFO'; payload: PaymentInfo }
  | { type: 'UPDATE_ORDER_SUMMARY'; payload: Partial<OrderSummary> }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_VALIDATION_ERRORS'; payload: Record<string, string[]> }
  | { type: 'RESET_CHECKOUT' }

// Order Placement
export interface OrderInput {
  items: Array<{
    productId: string
    variantId?: string
    quantity: number
    price: number
  }>
  shippingAddress: Address
  billingAddress?: Address
  shippingMethod: string
  paymentMethod: {
    type: string
    details: Record<string, any>
  }
  promoCode?: string
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export interface OrderResult {
  id: string
  orderNumber: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered'
  totalAmount: number
  estimatedDelivery: Date
  createdAt: Date
}

// Available shipping methods
export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: '5-7 business days',
    price: 8.99,
    estimatedDays: 6,
    isDefault: true
  },
  {
    id: 'express',
    name: 'Express Shipping', 
    description: '2-3 business days',
    price: 15.99,
    estimatedDays: 3
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day',
    price: 24.99,
    estimatedDays: 1
  },
  {
    id: 'free',
    name: 'Free Shipping',
    description: '7-10 business days (orders over $75)',
    price: 0,
    estimatedDays: 8
  }
] 