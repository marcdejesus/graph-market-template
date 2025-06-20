'use client'

import { useCheckout } from '@/context/checkout-context'
import { CheckoutLayout } from './checkout-layout'

export function CheckoutFlow() {
  const { state } = useCheckout()

  // Render step content based on current step
  const renderStepContent = () => {
    switch (state.currentStep) {
      case 'cart':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Review Your Items</h3>
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Cart review step content will be implemented in Phase 6.2</p>
              <div className="text-sm text-gray-500">
                This step will show cart items, quantities, and allow final review before proceeding to shipping.
              </div>
            </div>
          </div>
        )

      case 'shipping':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Shipping Information</h3>
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Shipping step content will be implemented in Phase 6.2</p>
              <div className="text-sm text-gray-500">
                This step will collect shipping address and delivery method selection.
              </div>
            </div>
          </div>
        )

      case 'payment':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Payment step content will be implemented in Phase 6.2</p>
              <div className="text-sm text-gray-500">
                This step will collect payment method and billing information.
              </div>
            </div>
          </div>
        )

      case 'confirmation':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Order Confirmation</h3>
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">Confirmation step content will be implemented in Phase 6.2</p>
              <div className="text-sm text-gray-500">
                This step will show final order summary and place order button.
              </div>
            </div>
          </div>
        )

      default:
        return <div>Unknown step</div>
    }
  }

  return (
    <CheckoutLayout>
      {renderStepContent()}
    </CheckoutLayout>
  )
} 