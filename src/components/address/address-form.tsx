'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { addressFormSchema, type AddressFormData } from '@/lib/validation/address-schemas'
import { SUPPORTED_COUNTRIES, type AddressFormMode } from '@/types/address'

interface AddressFormProps {
  mode?: AddressFormMode
  initialData?: Partial<AddressFormData>
  onSubmit: (data: AddressFormData) => Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  showNickname?: boolean
  showDefaultOption?: boolean
  submitText?: string
  cancelText?: string
  className?: string
}

export function AddressForm({
  mode = 'create',
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  showNickname = true,
  showDefaultOption = true,
  submitText,
  cancelText = 'Cancel',
  className = ''
}: AddressFormProps) {
  const [selectedCountry, setSelectedCountry] = useState(initialData?.country || 'United States')
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      province: '',
      country: 'United States',
      zip: '',
      phone: '',
      nickname: '',
      isDefault: false,
      ...initialData
    }
  })

  // Watch country changes to update validation
  const watchedCountry = watch('country')
  
  useEffect(() => {
    setSelectedCountry(watchedCountry)
  }, [watchedCountry])

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset({
        firstName: '',
        lastName: '',
        company: '',
        address1: '',
        address2: '',
        city: '',
        province: '',
        country: 'United States',
        zip: '',
        phone: '',
        nickname: '',
        isDefault: false,
        ...initialData
      })
    }
  }, [initialData, reset])

  const handleFormSubmit = async (data: AddressFormData) => {
    try {
      await onSubmit(data)
    } catch (_error) {
      // Error handling is done in parent component
    }
  }

  const country = SUPPORTED_COUNTRIES.find(c => c.name === selectedCountry || c.code === selectedCountry)
  const isReadOnly = mode === 'view'
  const isEditing = mode === 'edit'
  const isCreating = mode === 'create'

  return (
    <Card className={`p-6 ${className}`}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName')}
              disabled={isReadOnly || isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              id="lastName"
              type="text"
              {...register('lastName')}
              disabled={isReadOnly || isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Company Field */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company (Optional)
          </label>
          <input
            id="company"
            type="text"
            {...register('company')}
            disabled={isReadOnly || isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
            placeholder="Enter company name"
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
          )}
        </div>

        {/* Address Fields */}
        <div>
          <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            id="address1"
            type="text"
            {...register('address1')}
            disabled={isReadOnly || isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
            placeholder="123 Main Street"
          />
          {errors.address1 && (
            <p className="mt-1 text-sm text-red-600">{errors.address1.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
            Apartment, suite, etc. (Optional)
          </label>
          <input
            id="address2"
            type="text"
            {...register('address2')}
            disabled={isReadOnly || isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
            placeholder="Apartment, suite, floor, etc."
          />
          {errors.address2 && (
            <p className="mt-1 text-sm text-red-600">{errors.address2.message}</p>
          )}
        </div>

        {/* City, State, Country, ZIP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              id="city"
              type="text"
              {...register('city')}
              disabled={isReadOnly || isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
              placeholder="Enter city"
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
              {country?.hasStates ? 'State' : 'Province/Region'} *
            </label>
            <input
              id="province"
              type="text"
              {...register('province')}
              disabled={isReadOnly || isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
              placeholder={country?.hasStates ? 'NY' : 'Province/Region'}
            />
            {errors.province && (
              <p className="mt-1 text-sm text-red-600">{errors.province.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              id="country"
              {...register('country')}
              disabled={isReadOnly || isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
            >
              {SUPPORTED_COUNTRIES.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
              {country?.code === 'US' ? 'ZIP Code' : 'Postal Code'} *
            </label>
            <input
              id="zip"
              type="text"
              {...register('zip')}
              disabled={isReadOnly || isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
              placeholder={country?.zipPlaceholder || '12345'}
            />
            {errors.zip && (
              <p className="mt-1 text-sm text-red-600">{errors.zip.message}</p>
            )}
          </div>
        </div>

        {/* Phone Field */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number (Optional)
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone')}
            disabled={isReadOnly || isLoading}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Nickname Field */}
        {showNickname && (
          <div>
            <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-1">
              Address Nickname (Optional)
            </label>
            <input
              id="nickname"
              type="text"
              {...register('nickname')}
              disabled={isReadOnly || isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100"
              placeholder="Home, Office, etc."
            />
            {errors.nickname && (
              <p className="mt-1 text-sm text-red-600">{errors.nickname.message}</p>
            )}
          </div>
        )}

        {/* Default Address Option */}
        {showDefaultOption && !isReadOnly && (
          <div className="flex items-center">
            <input
              id="isDefault"
              type="checkbox"
              {...register('isDefault')}
              disabled={isLoading}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-900">
              Set as default address
            </label>
          </div>
        )}

        {/* Form Actions */}
        {!isReadOnly && (
          <div className="flex gap-3 pt-4 border-t">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading || isSubmitting}
                className="flex-1"
              >
                {cancelText}
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading || isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isCreating ? 'Creating...' : isEditing ? 'Updating...' : 'Saving...'}
                </div>
              ) : (
                submitText || (isCreating ? 'Create Address' : isEditing ? 'Update Address' : 'Save Address')
              )}
            </Button>
          </div>
        )}
      </form>
    </Card>
  )
} 