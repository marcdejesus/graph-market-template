// ESLint disabled for unused vars
'use client'

import { useState, useEffect } from 'react'
import { ProductFilters as ProductFiltersType, FilterOption } from '@/types/product'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Filter, ChevronDown, ChevronUp } from 'lucide-react'

interface ProductFiltersProps {
  filters: ProductFiltersType
  availableFilters: {
    categories: FilterOption[]
    sizes: FilterOption[]
    colors: FilterOption[]
    brands: FilterOption[]
    priceRange: { min: number; max: number }
  }
  onFiltersChange: (_filters: ProductFiltersType) => void
  onClearFilters: () => void
  className?: string
}

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-steel-200 pb-6 mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <h3 className="text-lg font-medium text-athletic-black">{title}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-steel-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-steel-500" />
        )}
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  )
}

interface PriceRangeSliderProps {
  min: number
  max: number
  value: [number, number]
  onChange: (_value: [number, number]) => void
}

function PriceRangeSlider({ min, max, value, onChange }: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleMinChange = (newMin: number) => {
    const clampedMin = Math.max(min, Math.min(newMin, localValue[1] - 1))
    const newValue: [number, number] = [clampedMin, localValue[1]]
    setLocalValue(newValue)
    onChange(newValue)
  }

  const handleMaxChange = (newMax: number) => {
    const clampedMax = Math.min(max, Math.max(newMax, localValue[0] + 1))
    const newValue: [number, number] = [localValue[0], clampedMax]
    setLocalValue(newValue)
    onChange(newValue)
  }

  const minPercent = ((localValue[0] - min) / (max - min)) * 100
  const maxPercent = ((localValue[1] - min) / (max - min)) * 100

  return (
    <div className="space-y-4">
      <div className="relative h-2 bg-steel-200 rounded-full">
        {/* Active range */}
        <div
          className="absolute h-2 bg-performance-500 rounded-full"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />
        
        {/* Min thumb */}
        <div
          className="absolute w-4 h-4 bg-performance-500 rounded-full -mt-1 cursor-pointer border-2 border-white shadow-md"
          style={{ left: `calc(${minPercent}% - 8px)` }}
        />
        
        {/* Max thumb */}
        <div
          className="absolute w-4 h-4 bg-performance-500 rounded-full -mt-1 cursor-pointer border-2 border-white shadow-md"
          style={{ left: `calc(${maxPercent}% - 8px)` }}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-steel-600">$</span>
          <input
            type="number"
            value={localValue[0]}
            onChange={(e) => handleMinChange(parseInt(e.target.value) || min)}
            className="w-20 px-2 py-1 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-performance-500"
            min={min}
            max={max}
          />
        </div>
        <span className="text-steel-400">to</span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-steel-600">$</span>
          <input
            type="number"
            value={localValue[1]}
            onChange={(e) => handleMaxChange(parseInt(e.target.value) || max)}
            className="w-20 px-2 py-1 text-sm border border-steel-300 rounded focus:outline-none focus:ring-2 focus:ring-performance-500"
            min={min}
            max={max}
          />
        </div>
      </div>
    </div>
  )
}

interface CheckboxFilterProps {
  options: FilterOption[]
  selectedValues: string[]
  onChange: (_values: string[]) => void
  showCount?: boolean
}

function CheckboxFilter({ options, selectedValues, onChange, showCount = true }: CheckboxFilterProps) {
  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    onChange(newValues)
  }

  return (
    <div className="space-y-3">
      {options.map((option) => (
        <label key={option.value} className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={selectedValues.includes(option.value)}
            onChange={() => handleToggle(option.value)}
            className="h-4 w-4 text-performance-500 border-steel-300 rounded focus:ring-performance-500"
          />
          <span className="text-sm text-athletic-black flex-1">
            {option.label}
          </span>
          {showCount && (
            <span className="text-xs text-steel-500">
              ({option.count})
            </span>
          )}
        </label>
      ))}
    </div>
  )
}

export function ProductFilters({
  filters,
  availableFilters,
  onFiltersChange,
  onClearFilters,
  className = ''
}: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ProductFiltersType>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (key: keyof ProductFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const hasActiveFilters = Object.values(localFilters).some(value => {
    if (Array.isArray(value)) return value.length > 0
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== undefined)
    }
    return value !== undefined && value !== null
  })

  const getActiveFilterCount = () => {
    let count = 0
    if (localFilters.category?.length) count += localFilters.category.length
    if (localFilters.sizes?.length) count += localFilters.sizes.length
    if (localFilters.colors?.length) count += localFilters.colors.length
    if (localFilters.brands?.length) count += localFilters.brands.length
    if (localFilters.priceRange) count += 1
    if (localFilters.inStock) count += 1
    if (localFilters.onSale) count += 1
    return count
  }

  return (
    <div className={`bg-white border border-steel-200 rounded-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-athletic-black" />
          <h2 className="text-xl font-semibold text-athletic-black">Filters</h2>
          {hasActiveFilters && (
            <Badge variant="default" className="ml-2">
              {getActiveFilterCount()}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="ghost"
            size="sm"
            className="text-performance-600 hover:text-performance-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Price Range */}
      <FilterSection title="Price Range">
        <PriceRangeSlider
          min={availableFilters.priceRange.min}
          max={availableFilters.priceRange.max}
          value={localFilters.priceRange ? [localFilters.priceRange.min, localFilters.priceRange.max] : [availableFilters.priceRange.min, availableFilters.priceRange.max]}
          onChange={([min, max]) => handleFilterChange('priceRange', { min, max })}
        />
      </FilterSection>

      {/* Categories */}
      {availableFilters.categories.length > 0 && (
        <FilterSection title="Categories">
          <CheckboxFilter
            options={availableFilters.categories}
            selectedValues={localFilters.category || []}
            onChange={(values) => handleFilterChange('category', values)}
          />
        </FilterSection>
      )}

      {/* Sizes */}
      {availableFilters.sizes.length > 0 && (
        <FilterSection title="Sizes">
          <CheckboxFilter
            options={availableFilters.sizes}
            selectedValues={localFilters.sizes || []}
            onChange={(values) => handleFilterChange('sizes', values)}
          />
        </FilterSection>
      )}

      {/* Colors */}
      {availableFilters.colors.length > 0 && (
        <FilterSection title="Colors">
          <CheckboxFilter
            options={availableFilters.colors}
            selectedValues={localFilters.colors || []}
            onChange={(values) => handleFilterChange('colors', values)}
          />
        </FilterSection>
      )}

      {/* Brands */}
      {availableFilters.brands.length > 0 && (
        <FilterSection title="Brands">
          <CheckboxFilter
            options={availableFilters.brands}
            selectedValues={localFilters.brands || []}
            onChange={(values) => handleFilterChange('brands', values)}
          />
        </FilterSection>
      )}

      {/* Stock & Sale Filters */}
      <FilterSection title="Availability">
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.inStock || false}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              className="h-4 w-4 text-performance-500 border-steel-300 rounded focus:ring-performance-500"
            />
            <span className="text-sm text-athletic-black">In Stock Only</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={localFilters.onSale || false}
              onChange={(e) => handleFilterChange('onSale', e.target.checked)}
              className="h-4 w-4 text-performance-500 border-steel-300 rounded focus:ring-performance-500"
            />
            <span className="text-sm text-athletic-black">On Sale</span>
          </label>
        </div>
      </FilterSection>
    </div>
  )
} 