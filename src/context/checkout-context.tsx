'use client'

import React, { createContext, useContext, useReducer, useCallback } from 'react'
import { useCartContext } from './cart-context'
import { 
  CheckoutState, 
  CheckoutAction, 
  CheckoutStep, 
  CheckoutStepInfo, 
  ShippingInfo, 
  PaymentInfo, 
  OrderSummary,
  OrderResult
} from '@/types/checkout'

// Initial checkout steps
const initialSteps: CheckoutStepInfo[] = [
  {
    id: 'cart',
    title: 'Cart Review',
    description: 'Review your items',
    isCompleted: false,
    isActive: true,
    isAccessible: true
  },
  {
    id: 'shipping',
    title: 'Shipping',
    description: 'Shipping address',
    isCompleted: false,
    isActive: false,
    isAccessible: false
  },
  {
    id: 'payment',
    title: 'Payment',
    description: 'Payment method',
    isCompleted: false,
    isActive: false,
    isAccessible: false
  },
  {
    id: 'confirmation',
    title: 'Confirmation',
    description: 'Order summary',
    isCompleted: false,
    isActive: false,
    isAccessible: false
  }
]

// Initial state
const initialCheckoutState: CheckoutState = {
  currentStep: 'cart',
  steps: initialSteps,
  orderSummary: {
    items: [],
    subtotal: 0,
    shipping: 0,
    tax: 0,
    discount: 0,
    total: 0,
    estimatedDelivery: new Date()
  },
  isLoading: false,
  error: null,
  validationErrors: {}
}

// Checkout reducer
function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload,
        steps: state.steps.map(step => ({
          ...step,
          isActive: step.id === action.payload
        }))
      }

    case 'UPDATE_STEP_STATUS':
      return {
        ...state,
        steps: state.steps.map(step => 
          step.id === action.payload.step
            ? {
                ...step,
                isCompleted: action.payload.isCompleted,
                isAccessible: action.payload.isAccessible
              }
            : step
        )
      }

    case 'SET_SHIPPING_INFO':
      return {
        ...state,
        shippingInfo: action.payload,
        orderSummary: {
          ...state.orderSummary,
          shipping: action.payload.method.price,
          total: state.orderSummary.subtotal + action.payload.method.price + state.orderSummary.tax - state.orderSummary.discount
        }
      }

    case 'SET_PAYMENT_INFO':
      return {
        ...state,
        paymentInfo: action.payload
      }

    case 'UPDATE_ORDER_SUMMARY':
      return {
        ...state,
        orderSummary: {
          ...state.orderSummary,
          ...action.payload
        }
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case 'SET_VALIDATION_ERRORS':
      return {
        ...state,
        validationErrors: action.payload
      }

    case 'RESET_CHECKOUT':
      return {
        ...initialCheckoutState,
        orderSummary: {
          ...initialCheckoutState.orderSummary,
          estimatedDelivery: new Date()
        }
      }

    default:
      return state
  }
}

// Context interface
interface CheckoutContextType {
  state: CheckoutState
  goToStep: (_step: CheckoutStep) => void
  goToNextStep: () => void
  goToPreviousStep: () => void
  completeStep: (_step: CheckoutStep) => void
  validateCurrentStep: () => Promise<boolean>
  setShippingInfo: (_info: ShippingInfo) => void
  setPaymentInfo: (_info: PaymentInfo) => void
  updateOrderSummary: (_summary: Partial<OrderSummary>) => void
  placeOrder: () => Promise<OrderResult>
  canProceedToNextStep: () => boolean
  getStepByIndex: (_index: number) => CheckoutStepInfo | undefined
  getCurrentStepIndex: () => number
  resetCheckout: () => void
  validateShippingInfo: (_info: Partial<ShippingInfo>) => Record<string, string>
  validatePaymentInfo: (_info: Partial<PaymentInfo>) => Record<string, string>
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined)

// Provider component
export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialCheckoutState)
  const { state: cartState } = useCartContext()

  // Initialize order summary from cart
  React.useEffect(() => {
    if (cartState.items.length > 0) {
      const subtotal = cartState.totalAmount
      const tax = subtotal * 0.0875 // 8.75% tax rate
      const shipping = subtotal >= 75 ? 0 : 8.99 // Free shipping over $75
      const estimatedDelivery = new Date()
      estimatedDelivery.setDate(estimatedDelivery.getDate() + (shipping === 0 ? 5 : 7))

      dispatch({
        type: 'UPDATE_ORDER_SUMMARY',
        payload: {
          items: cartState.items,
          subtotal,
          tax,
          shipping,
          total: subtotal + tax + shipping,
          estimatedDelivery
        }
      })
    }
  }, [cartState.items, cartState.totalAmount])

  // Get current step index
  const getCurrentStepIndex = useCallback(() => {
    return state.steps.findIndex(_step => _step.id === state.currentStep)
  }, [state.currentStep, state.steps])

  // Step navigation  
  const goToStep = useCallback((_step: CheckoutStep) => {
    const stepInfo = state.steps.find(s => s.id === _step)
    if (stepInfo?.isAccessible) {
      dispatch({ type: 'SET_CURRENT_STEP', payload: _step })
    }
  }, [state.steps])

  const goToNextStep = useCallback(() => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex < state.steps.length - 1) {
      const nextStep = state.steps[currentIndex + 1]
      if (nextStep?.isAccessible) {
        dispatch({ type: 'SET_CURRENT_STEP', payload: nextStep.id })
      }
    }
  }, [getCurrentStepIndex, state.steps])

  const goToPreviousStep = useCallback(() => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex > 0) {
      const previousStep = state.steps[currentIndex - 1]
      if (previousStep) {
        dispatch({ type: 'SET_CURRENT_STEP', payload: previousStep.id })
      }
    }
  }, [getCurrentStepIndex, state.steps])

  // Step management - simplified for Phase 6.1
  const completeStep = useCallback((_step: CheckoutStep) => {
    // Will be implemented in Phase 6.2
    // eslint-disable-next-line no-console
    console.log('completeStep - to be implemented in Phase 6.2')
  }, [])

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    // Will be implemented in Phase 6.2
    // eslint-disable-next-line no-console
    console.log('validateCurrentStep - to be implemented in Phase 6.2')
    return true
  }, [])

  // Data management - simplified for Phase 6.1
  const setShippingInfo = useCallback((_info: ShippingInfo) => {
    // Will be implemented in Phase 6.2
    // eslint-disable-next-line no-console
    console.log('setShippingInfo - to be implemented in Phase 6.2')
  }, [])

  const setPaymentInfo = useCallback((_info: PaymentInfo) => {
    // Will be implemented in Phase 6.2
    // eslint-disable-next-line no-console
    console.log('setPaymentInfo - to be implemented in Phase 6.2')
  }, [])

  const updateOrderSummary = useCallback((_summary: Partial<OrderSummary>) => {
    dispatch({ type: 'UPDATE_ORDER_SUMMARY', payload: _summary })
  }, [])

  // Order processing - simplified for Phase 6.1
  const placeOrder = useCallback(async (): Promise<OrderResult> => {
    // Mock order result for Phase 6.1
    return {
      id: `order_${Date.now()}`,
      orderNumber: `FIT${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      status: 'confirmed',
      totalAmount: state.orderSummary.total,
      estimatedDelivery: state.orderSummary.estimatedDelivery,
      createdAt: new Date()
    }
  }, [state.orderSummary])

  // Utilities
  const canProceedToNextStep = useCallback((): boolean => {
    const currentIndex = getCurrentStepIndex()
    return currentIndex < state.steps.length - 1 && 
           (state.steps[currentIndex + 1]?.isAccessible ?? false)
  }, [getCurrentStepIndex, state.steps])

  const getStepByIndex = useCallback((_index: number) => {
    return state.steps[_index]
  }, [state.steps])

  const resetCheckout = useCallback(() => {
    dispatch({ type: 'RESET_CHECKOUT' })
  }, [])

  // Form validation - simplified for Phase 6.1
  const validateShippingInfo = useCallback((_info: Partial<ShippingInfo>): Record<string, string> => {
    // Will be implemented in Phase 6.2
    return {}
  }, [])

  const validatePaymentInfo = useCallback((_info: Partial<PaymentInfo>): Record<string, string> => {
    // Will be implemented in Phase 6.2
    return {}
  }, [])

  const contextValue: CheckoutContextType = {
    state,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    completeStep,
    validateCurrentStep,
    setShippingInfo,
    setPaymentInfo,
    updateOrderSummary,
    placeOrder,
    canProceedToNextStep,
    getStepByIndex,
    getCurrentStepIndex,
    resetCheckout,
    validateShippingInfo,
    validatePaymentInfo
  }

  return (
    <CheckoutContext.Provider value={contextValue}>
      {children}
    </CheckoutContext.Provider>
  )
}

// Hook to use checkout context
export function useCheckout(): CheckoutContextType {
  const context = useContext(CheckoutContext)
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider')
  }
  return context
} 