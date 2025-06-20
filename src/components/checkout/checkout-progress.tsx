'use client'

import { Check, ChevronRight } from 'lucide-react'
import { useCheckout } from '@/context/checkout-context'
import { CheckoutStepInfo } from '@/types/checkout'

interface CheckoutProgressProps {
  className?: string
}

export function CheckoutProgress({ className = '' }: CheckoutProgressProps) {
  const { state, goToStep } = useCheckout()

  const handleStepClick = (step: CheckoutStepInfo) => {
    if (step.isAccessible) {
      goToStep(step.id)
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Progress */}
      <div className="hidden md:block">
        <nav aria-label="Checkout progress">
          <ol className="flex items-center justify-between">
            {state.steps.map((step, index) => (
              <li key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  {/* Step Circle */}
                  <button
                    onClick={() => handleStepClick(step)}
                    disabled={!step.isAccessible}
                    className={`
                      relative flex items-center justify-center w-10 h-10 rounded-full border-2 font-medium text-sm transition-all duration-200
                      ${step.isCompleted 
                        ? 'bg-[#e53e3e] border-[#e53e3e] text-white' 
                        : step.isActive 
                          ? 'bg-white border-[#e53e3e] text-[#e53e3e] ring-4 ring-red-100' 
                          : step.isAccessible
                            ? 'bg-white border-gray-300 text-gray-500 hover:border-[#e53e3e] hover:text-[#e53e3e] cursor-pointer'
                            : 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                      }
                    `}
                    aria-current={step.isActive ? 'step' : undefined}
                  >
                    {step.isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </button>

                  {/* Step Label */}
                  <div className="ml-3 min-w-0">
                    <p className={`text-sm font-medium ${
                      step.isActive ? 'text-[#e53e3e]' : 
                      step.isCompleted ? 'text-gray-900' : 
                      'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector */}
                {index < state.steps.length - 1 && (
                  <div className="flex-1 mx-6">
                    <div className={`h-0.5 ${
                      (state.steps[index + 1]?.isAccessible || state.steps[index + 1]?.isCompleted)
                        ? 'bg-[#e53e3e]' 
                        : 'bg-gray-200'
                    }`} />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* Mobile Progress */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`
              flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium
              ${state.steps.find(s => s.isActive)?.isCompleted 
                ? 'bg-[#e53e3e] border-[#e53e3e] text-white' 
                : 'bg-white border-[#e53e3e] text-[#e53e3e]'
              }
            `}>
              {state.steps.find(s => s.isActive)?.isCompleted ? (
                <Check className="w-4 h-4" />
              ) : (
                <span>{state.steps.findIndex(s => s.isActive) + 1}</span>
              )}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {state.steps.find(s => s.isActive)?.title}
              </p>
              <p className="text-xs text-gray-500">
                Step {state.steps.findIndex(s => s.isActive) + 1} of {state.steps.length}
              </p>
            </div>
          </div>

          {/* Mobile Step Navigation */}
          <div className="flex items-center space-x-2">
            {state.steps.map((step, _index) => (
              <div
                key={step.id}
                className={`w-2 h-2 rounded-full ${
                  step.isCompleted ? 'bg-[#e53e3e]' :
                  step.isActive ? 'bg-[#e53e3e]' :
                  step.isAccessible ? 'bg-gray-300' :
                  'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-[#e53e3e] h-1 rounded-full transition-all duration-300"
            style={{ 
              width: `${((state.steps.findIndex(s => s.isActive) + 1) / state.steps.length) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="mt-4 text-sm text-gray-500">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            {state.steps.map((step, index) => (
              <li key={step.id} className="inline-flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                )}
                <button
                  onClick={() => handleStepClick(step)}
                  disabled={!step.isAccessible}
                  className={`text-sm ${
                    step.isActive ? 'text-[#e53e3e] font-medium' :
                    step.isAccessible ? 'text-gray-600 hover:text-[#e53e3e]' :
                    'text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {step.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  )
} 