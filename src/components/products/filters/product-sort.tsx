// ESLint disabled for unused vars
'use client'

import { useState } from 'react'
import { ProductSortOptions } from '@/types/product'
import { ChevronDown } from 'lucide-react'

interface ProductSortProps {
  sortOptions: ProductSortOptions
  onSortChange: (_sort: ProductSortOptions) => void
  className?: string
}

interface SortOption {
  value: string
  label: string
  field: ProductSortOptions['field']
  direction: ProductSortOptions['direction']
}

const SORT_OPTIONS: SortOption[] = [
  { value: 'popularity_desc', label: 'Most Popular', field: 'popularity', direction: 'desc' },
  { value: 'newest', label: 'Newest First', field: 'createdAt', direction: 'desc' },
  { value: 'oldest', label: 'Oldest First', field: 'createdAt', direction: 'asc' },
  { value: 'price_asc', label: 'Price: Low to High', field: 'price', direction: 'asc' },
  { value: 'price_desc', label: 'Price: High to Low', field: 'price', direction: 'desc' },
  { value: 'name_asc', label: 'Name: A to Z', field: 'name', direction: 'asc' },
  { value: 'name_desc', label: 'Name: Z to A', field: 'name', direction: 'desc' },
  { value: 'rating_desc', label: 'Highest Rated', field: 'rating', direction: 'desc' },
  { value: 'rating_asc', label: 'Lowest Rated', field: 'rating', direction: 'asc' },
]

export function ProductSort({ sortOptions, onSortChange, className = '' }: ProductSortProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentSort = SORT_OPTIONS.find(
    option => option.field === sortOptions.field && option.direction === sortOptions.direction
  ) ?? SORT_OPTIONS[0]

  const handleSortSelect = (option: SortOption) => {
    onSortChange({
      field: option.field,
      direction: option.direction,
    })
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full sm:w-auto min-w-[200px] px-4 py-2 text-sm bg-white border border-steel-300 rounded-md focus:outline-none focus:ring-2 focus:ring-performance-500 hover:border-steel-400 transition-colors"
      >
        <span className="text-athletic-black">{currentSort.label}</span>
        <ChevronDown className={`h-4 w-4 text-steel-500 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 right-0 sm:right-auto sm:min-w-[240px] mt-1 bg-white border border-steel-200 rounded-md shadow-lg z-20">
            <div className="py-1">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortSelect(option)}
                  className={`w-full px-4 py-2 text-sm text-left hover:bg-steel-50 transition-colors ${
                    option.value === currentSort.value
                      ? 'bg-performance-50 text-performance-700 font-medium'
                      : 'text-athletic-black'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
} 