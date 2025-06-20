'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCheckout } from '@/context/checkout-context'
import { useAddressBook } from '@/context/address-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddressForm, AddressDisplay } from '@/components/address'
import { shippingInfoSchema, type ShippingInfo } from '@/lib/validation/checkout-schemas'
import { SavedAddress, type AddressFormData } from '@/types/address'
import { SHIPPING_METHODS } from '@/types/checkout'
import { Truck, Clock, CreditCard, CheckCircle, Plus, MapPin } from 'lucide-react'

export function ShippingStep() {
  const { 
    state: checkoutState, 
    setShippingInfo, 
    goToNextStep, 
    validateCurrentStep 
  } = useCheckout()
  
  const { 
    addresses, 
    defaultAddress, 
    isLoading: addressLoading,
    createAddress 
  } = useAddressBook()

  const [selectedMethod, setSelectedMethod] = useState(SHIPPING_METHODS[0])
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  // Initialize with default address if available
  useEffect(() => {
    if (defaultAddress && !selectedAddress) {
      setSelectedAddress(defaultAddress)
    } else if (addresses.length > 0 && !selectedAddress) {
      setSelectedAddress(addresses[0])
    }
  }, [defaultAddress, addresses, selectedAddress])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset
  } = useForm<ShippingInfo>({
    resolver: zodResolver(shippingInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      company: '',
      address: '',
      apartment: '',
      city: '',
      country: 'United States',
      state: '',
      zip: '',
      phone: '',
      shippingMethod: SHIPPING_METHODS[0].id
    }
  })

  // Update form when address is selected
  useEffect(() => {
    if (selectedAddress) {
      setValue('firstName', selectedAddress.firstName)
      setValue('lastName', selectedAddress.lastName)
      setValue('company', selectedAddress.company || '')
      setValue('address', selectedAddress.address1)
      setValue('apartment', selectedAddress.address2 || '')
      setValue('city', selectedAddress.city)
      setValue('country', selectedAddress.country)
      setValue('state', selectedAddress.province)
      setValue('zip', selectedAddress.zip)
      setValue('phone', selectedAddress.phone || '')
    }
  }, [selectedAddress, setValue])

  const handleAddressSelect = (address: SavedAddress) => {
    setSelectedAddress(address)
    setShowNewAddressForm(false)
  }

  const handleCreateNewAddress = async (data: AddressFormData) => {
    try {
      const newAddress = await createAddress(data)
      setSelectedAddress(newAddress)
      setShowNewAddressForm(false)
    } catch (error) {
      console.error('Failed to create address:', error)
    }
  }

  const handleMethodSelect = (method: typeof SHIPPING_METHODS[0]) => {
    setSelectedMethod(method)
    setValue('shippingMethod', method.id)
  }

  const handleFormSubmit = async () => {
    if (!selectedAddress) {
      alert('Please select a shipping address')
      return
    }

    setIsValidating(true)
    
    try {
      const shippingInfo: ShippingInfo = {
        firstName: selectedAddress.firstName,
        lastName: selectedAddress.lastName,
        company: selectedAddress.company || '',
        address: selectedAddress.address1,
        apartment: selectedAddress.address2 || '',
        city: selectedAddress.city,
        country: selectedAddress.country,
        state: selectedAddress.province,
        zip: selectedAddress.zip,
        phone: selectedAddress.phone || '',
        shippingMethod: selectedMethod.id
      }

      await setShippingInfo(shippingInfo)
      
      const isValid = await validateCurrentStep()
      if (isValid) {
        goToNextStep()
      }
    } catch (error) {
      console.error('Shipping validation error:', error)
    } finally {
      setIsValidating(false)
    }
  }

  const orderTotal = checkoutState.orderSummary?.total || 0
  const qualifiesForFreeShipping = orderTotal >= 75

  return (
    <div className="space-y-6">
      {/* Shipping Address Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-red-600" />
          Shipping Address
        </h3>

        {addressLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-gray-600">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
              Loading addresses...
            </div>
          </div>
        ) : (
          <>
            {/* Saved Addresses */}
            {addresses.length > 0 && !showNewAddressForm && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-700">Choose from saved addresses:</h4>
                
                <div className="space-y-3">
                  {addresses.map(address => (
                    <div
                      key={address.id}
                      onClick={() => handleAddressSelect(address)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedAddress?.id === address.id
                          ? 'border-red-500 bg-red-50 ring-2 ring-red-500'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <AddressDisplay address={address} />
                        {selectedAddress?.id === address.id && (
                          <CheckCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewAddressForm(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Address
                </Button>
              </div>
            )}

            {/* New Address Form */}
            {(addresses.length === 0 || showNewAddressForm) && (
              <div className="space-y-4">
                {showNewAddressForm && (
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700">Add new address:</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewAddressForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
                
                <AddressForm
                  mode="create"
                  onSubmit={handleCreateNewAddress}
                  isLoading={addressLoading}
                  showNickname={true}
                  showDefaultOption={true}
                  submitText="Save & Use This Address"
                  cancelText="Cancel"
                  onCancel={addresses.length > 0 ? () => setShowNewAddressForm(false) : undefined}
                />
              </div>
            )}
          </>
        )}
      </Card>

      {/* Shipping Method Section */}
      {selectedAddress && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Truck className="w-5 h-5 mr-2 text-red-600" />
            Shipping Method
          </h3>

          <div className="space-y-3">
            {SHIPPING_METHODS.map((method) => {
              const isDisabled = method.id === 'free' && !qualifiesForFreeShipping
              const isSelected = selectedMethod.id === method.id

              return (
                <div
                  key={method.id}
                  onClick={() => !isDisabled && handleMethodSelect(method)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'border-red-500 bg-red-50 ring-2 ring-red-500'
                      : isDisabled
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        isSelected 
                          ? 'border-red-500 bg-red-500' 
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-full h-full rounded-full bg-white transform scale-50" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{method.name}</span>
                          {method.id === 'free' && qualifiesForFreeShipping && (
                            <Badge variant="success" className="bg-green-100 text-green-800">
                              Free
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                          <Clock className="w-4 h-4" />
                          {method.estimatedDays}
                        </div>
                        {isDisabled && (
                          <p className="text-xs text-gray-500 mt-1">
                            Requires ${75} minimum order
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {!qualifiesForFreeShipping && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 Add ${(75 - orderTotal).toFixed(2)} more to your order to qualify for free shipping!
              </p>
            </div>
          )}
        </Card>
      )}

      {/* Continue Button */}
      {selectedAddress && (
        <div className="flex justify-end">
          <Button
            onClick={handleFormSubmit}
            disabled={isValidating || addressLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-8"
          >
            {isValidating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                Continue to Payment
                <CreditCard className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
} 