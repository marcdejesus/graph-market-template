'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCheckout } from '@/context/checkout-context'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { addressSchema, type AddressFormData } from '@/lib/validation/checkout-schemas'
import { SHIPPING_METHODS, type ShippingMethod } from '@/types/checkout'
import { MapPin, Truck, Clock, Check } from 'lucide-react'

export function ShippingStep() {
  const { state, setShippingInfo, completeStep, goToNextStep } = useCheckout()
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod>(() => {
    return SHIPPING_METHODS.find(method => method.isDefault) || SHIPPING_METHODS[0]!
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: state.shippingInfo?.address || {
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      province: '',
      country: 'United States',
      zip: '',
      phone: ''
    }
  })

  const watchedValues = watch()

  const onSubmit = async (data: AddressFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate address validation
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Set shipping info in checkout context
      setShippingInfo({
        address: data,
        method: selectedShippingMethod
      })

      // Mark step as complete and proceed
      completeStep('shipping')
      goToNextStep()
    } catch (error) {
      console.error('Shipping info submission failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Shipping Address Form */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <input
                id="firstName"
                type="text"
                {...register('firstName')}
                className={`block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 ${
                  errors.firstName 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#e53e3e] focus:ring-[#e53e3e]'
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <input
                id="lastName"
                type="text"
                {...register('lastName')}
                className={`block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 ${
                  errors.lastName 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#e53e3e] focus:ring-[#e53e3e]'
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          {/* Company (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="company">Company (Optional)</Label>
            <input
              id="company"
              type="text"
              {...register('company')}
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:border-[#e53e3e] focus:ring-[#e53e3e]"
              placeholder="Company name"
            />
          </div>

          {/* Address Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address1">Street Address *</Label>
              <input
                id="address1"
                type="text"
                {...register('address1')}
                className={`block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 ${
                  errors.address1 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#e53e3e] focus:ring-[#e53e3e]'
                }`}
                placeholder="123 Main Street"
              />
              {errors.address1 && (
                <p className="text-sm text-red-600">{errors.address1.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address2">Apartment, suite, etc. (Optional)</Label>
              <input
                id="address2"
                type="text"
                {...register('address2')}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:border-[#e53e3e] focus:ring-[#e53e3e]"
                placeholder="Apt 4B, Suite 100, etc."
              />
            </div>
          </div>

          {/* City, State, ZIP */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <input
                id="city"
                type="text"
                {...register('city')}
                className={`block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 ${
                  errors.city 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#e53e3e] focus:ring-[#e53e3e]'
                }`}
                placeholder="New York"
              />
              {errors.city && (
                <p className="text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">State/Province *</Label>
              <input
                id="province"
                type="text"
                {...register('province')}
                className={`block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 ${
                  errors.province 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#e53e3e] focus:ring-[#e53e3e]'
                }`}
                placeholder="NY"
              />
              {errors.province && (
                <p className="text-sm text-red-600">{errors.province.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">ZIP/Postal Code *</Label>
              <input
                id="zip"
                type="text"
                {...register('zip')}
                className={`block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 ${
                  errors.zip 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#e53e3e] focus:ring-[#e53e3e]'
                }`}
                placeholder="10001"
              />
              {errors.zip && (
                <p className="text-sm text-red-600">{errors.zip.message}</p>
              )}
            </div>
          </div>

          {/* Country and Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <input
                id="country"
                type="text"
                {...register('country')}
                className={`block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 ${
                  errors.country 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#e53e3e] focus:ring-[#e53e3e]'
                }`}
                placeholder="United States"
              />
              {errors.country && (
                <p className="text-sm text-red-600">{errors.country.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <input
                id="phone"
                type="tel"
                {...register('phone')}
                className={`block w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 ${
                  errors.phone 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#e53e3e] focus:ring-[#e53e3e]'
                }`}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Shipping Methods */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Shipping Method</h3>
        </div>

        <div className="space-y-3">
          {SHIPPING_METHODS.map((method) => {
            const isSelected = selectedShippingMethod.id === method.id
            const isDisabled = method.id === 'free' && state.orderSummary.subtotal < 75

            return (
              <div
                key={method.id}
                className={`
                  relative border rounded-lg p-4 cursor-pointer transition-all duration-200
                  ${isSelected 
                    ? 'border-[#e53e3e] bg-red-50 ring-1 ring-[#e53e3e]' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                  ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => !isDisabled && setSelectedShippingMethod(method)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-4 h-4 rounded-full border-2 flex items-center justify-center
                      ${isSelected ? 'border-[#e53e3e] bg-[#e53e3e]' : 'border-gray-300'}
                    `}>
                      {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">{method.name}</span>
                        {method.isDefault && (
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        <Clock className="w-3 h-3" />
                        {method.description}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {method.price === 0 ? 'FREE' : `$${method.price.toFixed(2)}`}
                    </div>
                    {isDisabled && (
                      <div className="text-xs text-gray-500 mt-1">
                        Requires $75+ order
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || !watchedValues.firstName || !watchedValues.lastName || !watchedValues.address1}
          className="bg-[#e53e3e] hover:bg-[#c53030] text-white px-8 py-3 text-base"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Validating Address...
            </>
          ) : (
            'Continue to Review'
          )}
        </Button>
      </div>
    </div>
  )
} 