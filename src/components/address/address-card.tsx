'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SavedAddress } from '@/types/address'
import { Edit2, Trash2, MapPin, Phone, Building, Check, MoreVertical } from 'lucide-react'

interface AddressCardProps {
  address: SavedAddress
  onEdit?: (address: SavedAddress) => void
  onDelete?: (id: string) => void
  onSetDefault?: (id: string) => void
  isLoading?: boolean
  className?: string
}

export function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  isLoading = false,
  className = ''
}: AddressCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleEdit = () => {
    setShowMenu(false)
    onEdit?.(address)
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setIsProcessing(true)
      setShowMenu(false)
      try {
        await onDelete?.(address.id)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleSetDefault = async () => {
    setIsProcessing(true)
    setShowMenu(false)
    try {
      await onSetDefault?.(address.id)
    } finally {
      setIsProcessing(false)
    }
  }

  const formatAddress = () => {
    const parts = [
      address.address1,
      address.address2,
      address.city,
      address.province,
      address.zip
    ].filter(Boolean)
    
    return parts.join(', ')
  }

  const formatName = () => {
    return `${address.firstName} ${address.lastName}`
  }

  const isDisabled = isLoading || isProcessing

  return (
    <Card className={`relative p-4 hover:shadow-md transition-shadow ${className}`}>
      {/* Default Badge */}
      {address.isDefault && (
        <Badge variant="default" className="absolute top-3 right-3 bg-green-100 text-green-800">
          <Check className="w-3 h-3 mr-1" />
          Default
        </Badge>
      )}

      {/* Menu Button */}
      <div className="absolute top-3 right-3">
        {!address.isDefault && (
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              disabled={isDisabled}
              className="p-1 h-8 w-8"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border z-10">
                <div className="py-1">
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      disabled={isDisabled}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Address
                    </button>
                  )}
                  
                  {onSetDefault && !address.isDefault && (
                    <button
                      onClick={handleSetDefault}
                      disabled={isDisabled}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Set as Default
                    </button>
                  )}
                  
                  {onDelete && (
                    <button
                      onClick={handleDelete}
                      disabled={isDisabled}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Address
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Default address menu (only edit and delete) */}
        {address.isDefault && (
          <div className="relative ml-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              disabled={isDisabled}
              className="p-1 h-8 w-8"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>

            {showMenu && (
              <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border z-10">
                <div className="py-1">
                  {onEdit && (
                    <button
                      onClick={handleEdit}
                      disabled={isDisabled}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Address
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Click away to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}

      {/* Address Content */}
      <div className="space-y-3 pr-12">
        {/* Name and Nickname */}
        <div>
          <h3 className="font-semibold text-gray-900">{formatName()}</h3>
          {address.nickname && (
            <p className="text-sm text-gray-600 mt-1">"{address.nickname}"</p>
          )}
        </div>

        {/* Company */}
        {address.company && (
          <div className="flex items-center text-sm text-gray-600">
            <Building className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{address.company}</span>
          </div>
        )}

        {/* Address */}
        <div className="flex items-start text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p>{formatAddress()}</p>
            <p>{address.country}</p>
          </div>
        </div>

        {/* Phone */}
        {address.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{address.phone}</span>
          </div>
        )}

        {/* Verification Status */}
        <div className="flex items-center gap-2">
          {address.isVerified ? (
            <Badge variant="success" className="bg-green-100 text-green-800">
              <Check className="w-3 h-3 mr-1" />
              Verified
            </Badge>
          ) : (
            <Badge variant="warning" className="bg-yellow-100 text-yellow-800">
              Unverified
            </Badge>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-red-600 rounded-full animate-spin" />
            Processing...
          </div>
        </div>
      )}
    </Card>
  )
}

// Quick address display component (for read-only displays)
export function AddressDisplay({ 
  address, 
  showPhone = false, 
  className = '' 
}: { 
  address: SavedAddress
  showPhone?: boolean
  className?: string 
}) {
  const formatAddress = () => {
    const parts = [
      address.address1,
      address.address2,
      address.city,
      address.province,
      address.zip,
      address.country
    ].filter(Boolean)
    
    return parts.join(', ')
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="font-medium">
        {address.firstName} {address.lastName}
        {address.nickname && (
          <span className="text-sm text-gray-500 font-normal"> ({address.nickname})</span>
        )}
      </div>
      
      {address.company && (
        <div className="text-sm text-gray-600">{address.company}</div>
      )}
      
      <div className="text-sm text-gray-600">
        {formatAddress()}
      </div>
      
      {showPhone && address.phone && (
        <div className="text-sm text-gray-600">{address.phone}</div>
      )}
      
      {address.isDefault && (
        <Badge variant="success" className="bg-green-100 text-green-800 text-xs">
          Default Address
        </Badge>
      )}
    </div>
  )
} 