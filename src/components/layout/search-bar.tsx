'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface SearchSuggestion {
  id: string
  title: string
  category: string
  type: 'product' | 'category' | 'brand'
}

interface SearchBarProps {
  className?: string
  placeholder?: string
  isMobile?: boolean
}

export function SearchBar({ className, placeholder = "Search for products...", isMobile = false }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Mock suggestions - in real app this would come from API
  const mockSuggestions: SearchSuggestion[] = [
    { id: '1', title: 'Athletic T-Shirts', category: 'Tops', type: 'category' },
    { id: '2', title: 'Running Shorts', category: 'Bottoms', type: 'category' },
    { id: '3', title: 'Nike Performance Tee', category: 'Tops', type: 'product' },
    { id: '4', title: 'Adidas Training Pants', category: 'Bottoms', type: 'product' },
    { id: '5', title: 'Under Armour', category: 'Brands', type: 'brand' },
    { id: '6', title: 'Athletic Hoodies', category: 'Outerwear', type: 'category' },
    { id: '7', title: 'Workout Accessories', category: 'Accessories', type: 'category' },
  ]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Handle search input
  const handleInputChange = (value: string) => {
    setQuery(value)
    
    if (value.length > 1) {
      setIsLoading(true)
      // Simulate API delay
      setTimeout(() => {
        const filtered = mockSuggestions.filter(suggestion =>
          suggestion.title.toLowerCase().includes(value.toLowerCase()) ||
          suggestion.category.toLowerCase().includes(value.toLowerCase())
        )
        setSuggestions(filtered)
        setIsOpen(true)
        setIsLoading(false)
      }, 200)
    } else {
      setSuggestions([])
      setIsOpen(false)
      setIsLoading(false)
    }
  }

  // Handle search submission
  const handleSearch = (searchQuery?: string) => {
    const searchTerm = searchQuery || query
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}` as any)
      setIsOpen(false)
      if (isMobile) {
        inputRef.current?.blur()
      }
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title)
    
    // Navigate based on suggestion type
    switch (suggestion.type) {
      case 'category':
        router.push(`/categories/${suggestion.title.toLowerCase().replace(/\s+/g, '-')}` as any)
        break
      case 'brand':
        router.push(`/brands/${suggestion.title.toLowerCase().replace(/\s+/g, '-')}` as any)
        break
      case 'product':
        router.push(`/search?q=${encodeURIComponent(suggestion.title)}` as any)
        break
      default:
        handleSearch(suggestion.title)
    }
    
    setIsOpen(false)
    if (isMobile) {
      inputRef.current?.blur()
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSearch()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      inputRef.current?.blur()
    }
  }

  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'category':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        )
      case 'brand':
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        )
      case 'product':
      default:
        return (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        )
    }
  }

  return (
    <div className={cn("relative", className)} ref={searchRef}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 1 && setSuggestions(mockSuggestions.filter(s => 
            s.title.toLowerCase().includes(query.toLowerCase())
          )) && setIsOpen(true)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border border-steel-gray bg-white px-4 py-2 pl-10 pr-4 text-athletic-black placeholder-steel-gray transition-all duration-200 focus:border-performance-500 focus:outline-none focus:ring-1 focus:ring-performance-500",
            isMobile ? "text-base" : "text-sm"
          )}
        />
        
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <svg className="h-4 w-4 text-steel-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-steel-gray border-t-performance-500"></div>
          </div>
        )}
      </div>

      {/* Search Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-lg bg-white border border-steel-200 shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="py-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-steel-50 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-steel-400 group-hover:text-performance-500 transition-colors">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-athletic-black truncate">
                      {suggestion.title}
                    </p>
                    <p className="text-xs text-steel-gray">
                      {suggestion.type === 'brand' ? 'Brand' : `in ${suggestion.category}`}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Search for query */}
          {query.trim() && (
            <div className="border-t border-steel-100">
              <button
                onClick={() => handleSearch()}
                className="w-full px-4 py-3 text-left hover:bg-steel-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-performance-500">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-athletic-black">
                      Search for "{query}"
                    </p>
                    <p className="text-xs text-steel-gray">
                      Press Enter or click to search
                    </p>
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 