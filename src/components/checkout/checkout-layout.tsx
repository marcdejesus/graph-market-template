'use client'

import { ReactNode } from 'react'
import { useCheckout } from '@/context/checkout-context'
import { CheckoutProgress } from './checkout-progress'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'

interface CheckoutLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
  showBackButton?: boolean
  showNextButton?: boolean
  nextButtonText?: string
  nextButtonDisabled?: boolean
  onNext?: () => void | Promise<void>
  onBack?: () => void
}

export function CheckoutLayout({
  children,
  title,
  subtitle,
  showBackButton = true,
  showNextButton = true,
  nextButtonText = 'Continue',
  nextButtonDisabled = false,
  onNext,
  onBack
}: CheckoutLayoutProps) {
  const { 
    state, 
    goToPreviousStep, 
    goToNextStep, 
    canProceedToNextStep,
    getCurrentStepIndex 
  } = useCheckout()

  const currentStepIndex = getCurrentStepIndex()
  const canGoBack = currentStepIndex > 0
  const canGoNext = canProceedToNextStep()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else if (canGoBack) {
      goToPreviousStep()
    }
  }

  const handleNext = async () => {
    if (onNext) {
      await onNext()
    } else if (canGoNext) {
      goToNextStep()
    }
  }

  const currentStep = state.steps.find(step => step.isActive)
  const stepTitle = title || currentStep?.title || 'Checkout'
  const stepSubtitle = subtitle || currentStep?.description

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bebas font-bold text-gray-900 mb-2">
            Secure Checkout
          </h1>
          <p className="text-gray-600">
            Complete your order securely and safely
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <CheckoutProgress />
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Step Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {stepTitle}
                </h2>
                {stepSubtitle && (
                  <p className="text-sm text-gray-600 mt-1">
                    {stepSubtitle}
                  </p>
                )}
              </div>
              
              {/* Step Counter */}
              <div className="text-sm text-gray-500">
                Step {currentStepIndex + 1} of {state.steps.length}
              </div>
            </div>

            {/* Error Display */}
            {state.error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{state.error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Errors */}
            {Object.keys(state.validationErrors).length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-700">Please fix the following errors:</p>
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                      {Object.entries(state.validationErrors).map(([field, errors]) =>
                        errors.map((error, index) => (
                          <li key={`${field}-${index}`}>{error}</li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step Content */}
          <div className="px-6 py-6">
            {children}
          </div>

          {/* Navigation Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <div>
                {showBackButton && canGoBack && (
                  <Button
                    variant="outline"
                    onClick={handleBack}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                )}
              </div>

              {/* Next Button */}
              <div>
                {showNextButton && (
                  <Button
                    onClick={handleNext}
                    disabled={nextButtonDisabled || state.isLoading || !canGoNext}
                    className="bg-[#e53e3e] hover:bg-[#c53030] text-white flex items-center gap-2 min-w-[120px]"
                  >
                    {state.isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        {nextButtonText}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-4 flex items-center justify-center text-xs text-gray-500">
              <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secured by 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 