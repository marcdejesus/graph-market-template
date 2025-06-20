'use client'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { OrderStatus, OrderFilters } from '@/types/order'
import { Search, Filter, X } from 'lucide-react'

interface OrderFiltersProps {
  filters: OrderFilters
  onFiltersChange: (_filters: OrderFilters) => void
  onSearch: (_query: string) => void
  totalCount?: number
}

const ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'confirmed', 
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
]

export function OrderFilters({ 
  filters, 
  onFiltersChange, 
  onSearch,
  totalCount = 0 
}: OrderFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch(query)
  }

  const handleStatusFilter = (status: OrderStatus) => {
    const currentStatuses = filters.status || []
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter(s => s !== status)
      : [...currentStatuses, status]
    
    onFiltersChange({
      ...filters,
      status: newStatuses.length > 0 ? newStatuses : undefined
    })
  }

  const handleDateRangeFilter = (range: 'week' | 'month' | 'quarter' | 'year') => {
    const now = new Date()
    const dateFrom = new Date()
    
    switch (range) {
      case 'week':
        dateFrom.setDate(now.getDate() - 7)
        break
      case 'month':
        dateFrom.setMonth(now.getMonth() - 1)
        break
      case 'quarter':
        dateFrom.setMonth(now.getMonth() - 3)
        break
      case 'year':
        dateFrom.setFullYear(now.getFullYear() - 1)
        break
    }

    onFiltersChange({
      ...filters,
      dateFrom: dateFrom.toISOString().split('T')[0],
      dateTo: now.toISOString().split('T')[0]
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    onFiltersChange({})
    onSearch('')
  }

  const hasActiveFilters = !!(
    filters.status?.length || 
    filters.dateFrom || 
    filters.dateTo || 
    searchQuery
  )

  const getStatusLabel = (status: OrderStatus) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order number..."
            value={searchQuery}
            onChange={(value) => handleSearch(value)}
            className="pl-10"
          />
        </div>

        {/* Filter Toggle */}
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge variant="error" size="sm" className="ml-2">
              {(filters.status?.length || 0) + (filters.dateFrom ? 1 : 0)}
            </Badge>
          )}
        </Button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="mt-3 text-sm text-gray-600">
        {totalCount > 0 ? (
          <span>{totalCount} order{totalCount !== 1 ? 's' : ''} found</span>
        ) : (
          <span>No orders found</span>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Status
              </label>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map((status) => {
                  const isSelected = filters.status?.includes(status)
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                        isSelected
                          ? 'bg-performance-red text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {getStatusLabel(status)}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Date Range Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date Range
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'week', label: 'Last Week' },
                  { value: 'month', label: 'Last Month' },
                  { value: 'quarter', label: 'Last 3 Months' },
                  { value: 'year', label: 'Last Year' }
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleDateRangeFilter(value as any)}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 