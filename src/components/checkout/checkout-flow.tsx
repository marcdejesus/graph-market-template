'use client'

import { useCheckout } from '@/context/checkout-context'
import { CartReviewStep } from './steps/cart-review-step'
import { ShippingStep } from './steps/shipping-step'
import { ConfirmationStep } from './steps/confirmation-step'
import { OrderSuccessStep } from './steps/order-success-step'
import { CheckoutStepInfo } from '@/types/checkout'

export function CheckoutFlow() {
  const { state } = useCheckout()

  // For Phase 6.2, we're implementing the actual step components
  // Payment step will be added in a future phase
  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'cart':
        return <CartReviewStep />
      
      case 'shipping':
        return <ShippingStep />
      
      case 'payment':
        // For now, skip payment and go directly to confirmation
        // This will be implemented in a future phase
        return <ConfirmationStep />
      
      case 'confirmation':
        // Check if order has been placed by looking for order result
        // For now, show confirmation step (order review) until order is placed
        const orderPlaced = state.steps.find((step: CheckoutStepInfo) => step.id === 'confirmation')?.isCompleted
        
        if (orderPlaced) {
          return <OrderSuccessStep />
        } else {
          return <ConfirmationStep />
        }
      
      default:
        return <CartReviewStep />
    }
  }

  return (
    <div className="flex-1">
      {renderCurrentStep()}
    </div>
  )
} 