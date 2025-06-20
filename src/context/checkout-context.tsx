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

// Initial step configuration
const createInitialSteps = (): CheckoutStepInfo[] => [
  {
    id: 'cart',
    title: 'Review Cart',
    description: 'Review items and quantities',
    isCompleted: false,
    isActive: true,
    isAccessible: true
  },
  {
    id: 'shipping',
    title: 'Shipping',
    description: 'Delivery address and method',
    isCompleted: false,
    isActive: false,
    isAccessible: false
  },
  {
    id: 'payment',
    title: 'Payment',
    description: 'Payment and billing information',
    isCompleted: false,
    isActive: false,
    isAccessible: false
  },
  {
    id: 'confirmation',
    title: 'Confirmation',
    description: 'Review and place order',
    isCompleted: false,
    isActive: false,
    isAccessible: false
  }
]

// Initial checkout state
const initialCheckoutState: CheckoutState = {
  currentStep: 'cart',
  steps: createInitialSteps(),
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

// Reducer function
function checkoutReducer(state: CheckoutState, action: CheckoutAction): CheckoutState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload,
        steps: state.steps.map(_step => ({
          ..._step,
          isActive: _step.id === action.payload
        }))
      }

    case 'UPDATE_STEP_STATUS':
      return {
        ...state,
        steps: state.steps.map(_step =>
          _step.id === action.payload.step
            ? {
                ..._step,
                isCompleted: action.payload.isCompleted,
                isAccessible: action.payload.isAccessible
              }
            : _step
        )
      }

    case 'SET_SHIPPING_INFO':
      return {
        ...state,
        shippingInfo: action.payload
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
        error: action.payload
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

  // Step management
  const completeStep = useCallback((_step: CheckoutStep) => {
    // Mark current step as completed and make next step accessible
    dispatch({
      type: 'UPDATE_STEP_STATUS',
      payload: {
        step: _step,
        isCompleted: true,
        isAccessible: true
      }
    })

    // Make next step accessible
    const stepOrder: CheckoutStep[] = ['cart', 'shipping', 'payment', 'confirmation']
    const currentIndex = stepOrder.indexOf(_step)
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1]
      if (nextStep) {
        dispatch({
          type: 'UPDATE_STEP_STATUS',
          payload: {
            step: nextStep,
            isCompleted: false,
            isAccessible: true
          }
        })
      }
    }
  }, [])

  const validateCurrentStep = useCallback(async (): Promise<boolean> => {
    switch (state.currentStep) {
      case 'cart':
        return cartState.items.length > 0
      case 'shipping':
        return !!state.shippingInfo?.address && !!state.shippingInfo?.method
      case 'payment':
        return !!state.paymentInfo?.type
      case 'confirmation':
        return true
      default:
        return false
    }
  }, [state.currentStep, state.shippingInfo, state.paymentInfo, cartState.items])

  // Data management
  const setShippingInfo = useCallback((_info: ShippingInfo) => {
    dispatch({ type: 'SET_SHIPPING_INFO', payload: _info })
    
    // Update order summary with shipping cost
    const shippingCost = _info.method.price
    const subtotal = cartState.totalAmount
    const tax = subtotal * 0.0875
    const total = subtotal + shippingCost + tax
    
    dispatch({
      type: 'UPDATE_ORDER_SUMMARY',
      payload: {
        shipping: shippingCost,
        total
      }
    })
  }, [cartState.totalAmount])

  const setPaymentInfo = useCallback((_info: PaymentInfo) => {
    dispatch({ type: 'SET_PAYMENT_INFO', payload: _info })
  }, [])

  const updateOrderSummary = useCallback((_summary: Partial<OrderSummary>) => {
    dispatch({ type: 'UPDATE_ORDER_SUMMARY', payload: _summary })
  }, [])

  // Order processing
  const placeOrder = useCallback(async (): Promise<OrderResult> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock order result
      const orderResult: OrderResult = {
        id: `order_${Date.now()}`,
        orderNumber: `FIT${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        status: 'confirmed',
        totalAmount: state.orderSummary.total,
        estimatedDelivery: state.orderSummary.estimatedDelivery,
        createdAt: new Date()
      }
      
      // Complete confirmation step and go to final step if it exists
      completeStep('confirmation')
      
      return orderResult
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to place order' })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.orderSummary, completeStep])

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

  // Form validation helpers
  const validateShippingInfo = useCallback((_info: Partial<ShippingInfo>): Record<string, string> => {
    const errors: Record<string, string> = {}
    
    if (!_info.address?.firstName?.trim()) {
      errors.firstName = 'First name is required'
    }
    if (!_info.address?.lastName?.trim()) {
      errors.lastName = 'Last name is required'
    }
    if (!_info.address?.address1?.trim()) {
      errors.address1 = 'Street address is required'
    }
    if (!_info.address?.city?.trim()) {
      errors.city = 'City is required'
    }
    if (!_info.address?.province?.trim()) {
      errors.province = 'State/Province is required'
    }
    if (!_info.address?.zip?.trim()) {
      errors.zip = 'ZIP/Postal code is required'
    }
    if (!_info.address?.country?.trim()) {
      errors.country = 'Country is required'
    }
    if (!_info.method) {
      errors.method = 'Shipping method is required'
    }
    
    return errors
  }, [])

  const validatePaymentInfo = useCallback((_info: Partial<PaymentInfo>): Record<string, string> => {
    const errors: Record<string, string> = {}
    
    if (!_info.type) {
      errors.type = 'Payment method is required'
    }
    
    // Add specific validation based on payment type
    if (_info.type === 'card') {
      if (!_info.cardNumber?.trim()) {
        errors.cardNumber = 'Card number is required'
      }
      if (!_info.expiryMonth || !_info.expiryYear) {
        errors.expiry = 'Expiry date is required'
      }
      if (!_info.cvv?.trim()) {
        errors.cvv = 'CVV is required'
      }
      if (!_info.cardholderName?.trim()) {
        errors.cardholderName = 'Cardholder name is required'
      }
    }
    
    return errors
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