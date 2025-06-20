'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AddressCard } from './address-card'
import { AddressForm } from './address-form'
import { useAddressBook } from '@/context/address-context'
import { SavedAddress, type AddressFormData } from '@/types/address'
import { Plus, Search, Filter, AlertCircle } from 'lucide-react'

interface AddressBookProps {
  onSelectAddress?: (address: SavedAddress) => void
  showSelection?: boolean
  selectedAddressId?: string
  className?: string
}

export function AddressBook({
  onSelectAddress,
  showSelection = false,
  selectedAddressId,
  className = ''
}: AddressBookProps) {
  const {
    addresses,
    isLoading,
    error,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    clearError
  } = useAddressBook()

  const [showForm, setShowForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [countryFilter, setCountryFilter] = useState('')

  // Filter addresses based on search and country
  const filteredAddresses = addresses.filter(address => {
    const matchesSearch = !searchQuery || 
      `${address.firstName} ${address.lastName} ${address.address1} ${address.city} ${address.nickname || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    
    const matchesCountry = !countryFilter || address.country === countryFilter
    
    return matchesSearch && matchesCountry
  })

  // Get unique countries for filter
  const countries = Array.from(new Set(addresses.map(addr => addr.country))).sort()

  const handleCreateAddress = async (data: AddressFormData) => {
    try {
      const newAddress = await createAddress(data)
      setShowForm(false)
      
      // If this is for selection, select the new address
      if (showSelection && onSelectAddress) {
        onSelectAddress(newAddress)
      }
    } catch (error) {
      // Error is handled by context
      console.error('Failed to create address:', error)
    }
  }

  const handleUpdateAddress = async (data: AddressFormData) => {
    if (!editingAddress) return
    
    try {
      const updatedAddress = await updateAddress({
        ...data,
        id: editingAddress.id
      })
      setEditingAddress(null)
      
      // If this is for selection and we're editing the selected address, update selection
      if (showSelection && onSelectAddress && selectedAddressId === editingAddress.id) {
        onSelectAddress(updatedAddress)
      }
    } catch (error) {
      // Error is handled by context
      console.error('Failed to update address:', error)
    }
  }

  const handleEditAddress = (address: SavedAddress) => {
    setEditingAddress(address)
    setShowForm(false)
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      await deleteAddress(id)
      
      // If deleting selected address, clear selection
      if (showSelection && selectedAddressId === id && onSelectAddress) {
        const remainingAddresses = addresses.filter(addr => addr.id !== id)
        if (remainingAddresses.length > 0) {
          const defaultAddr = remainingAddresses.find(addr => addr.isDefault)
          onSelectAddress(defaultAddr || remainingAddresses[0])
        }
      }
    } catch (error) {
      // Error is handled by context
      console.error('Failed to delete address:', error)
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    try {
      await setDefaultAddress(id)
    } catch (error) {
      // Error is handled by context
      console.error('Failed to set default address:', error)
    }
  }

  const handleSelectAddress = (address: SavedAddress) => {
    if (showSelection && onSelectAddress) {
      onSelectAddress(address)
    }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingAddress(null)
  }

  if (isLoading && addresses.length === 0) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <div className="flex items-center gap-2 text-gray-600">
          <div className="w-5 h-5 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
          Loading addresses...
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {showSelection ? 'Select Address' : 'Address Book'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {showSelection 
              ? 'Choose an existing address or create a new one'
              : 'Manage your saved addresses'
            }
          </p>
        </div>
        
        <Button
          onClick={() => setShowForm(true)}
          disabled={isLoading || showForm || editingAddress}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearError}
                className="mt-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter */}
      {addresses.length > 0 && !showForm && !editingAddress && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search addresses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
          
          {countries.length > 1 && (
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Add New Address</h3>
          <AddressForm
            mode="create"
            onSubmit={handleCreateAddress}
            onCancel={cancelForm}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Edit Form */}
      {editingAddress && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Edit Address</h3>
          <AddressForm
            mode="edit"
            initialData={editingAddress}
            onSubmit={handleUpdateAddress}
            onCancel={cancelForm}
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Address List */}
      {!showForm && !editingAddress && (
        <>
          {filteredAddresses.length === 0 && addresses.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No addresses match your search criteria.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setCountryFilter('')
                }}
                className="mt-4"
              >
                Clear Filters
              </Button>
            </div>
          )}

          {filteredAddresses.length === 0 && addresses.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
              <p className="text-gray-500 mb-6">Add your first address to get started.</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Address
              </Button>
            </div>
          )}

          {filteredAddresses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAddresses.map(address => (
                <div 
                  key={address.id} 
                  className="relative"
                  onClick={showSelection ? () => handleSelectAddress(address) : undefined}
                >
                  <AddressCard
                    address={address}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                    onSetDefault={handleSetDefaultAddress}
                    isLoading={isLoading}
                    className={showSelection ? 'cursor-pointer hover:ring-2 hover:ring-red-500' : ''}
                  />
                  
                  {/* Selection indicator */}
                  {showSelection && selectedAddressId === address.id && (
                    <div className="absolute inset-0 bg-red-50 bg-opacity-75 border-2 border-red-500 rounded-lg flex items-center justify-center pointer-events-none">
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Selected
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Loading overlay for actions */}
      {isLoading && addresses.length > 0 && !showForm && !editingAddress && (
        <div className="text-center py-4">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
            Processing...
          </div>
        </div>
      )}
    </div>
  )
} 