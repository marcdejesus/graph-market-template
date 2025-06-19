'use client'

import { Product } from '@/types'
import { ProductCard } from '@/components/products/product-card'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useRef } from 'react'

interface RelatedProductsProps {
  products: Product[]
  title?: string
  className?: string
}

export function RelatedProducts({ 
  products, 
  title = "You might also like",
  className = '' 
}: RelatedProductsProps) {
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current
    if (!container) return

    const scrollAmount = 320 // Width of one product card + gap
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })
  }

  const handleScroll = () => {
    const container = scrollContainerRef.current
    if (!container) return

    setCanScrollLeft(container.scrollLeft > 0)
    setCanScrollRight(
      container.scrollLeft < container.scrollWidth - container.clientWidth
    )
  }

  if (!products.length) {
    return null
  }

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bebas font-bold text-athletic-black">
            {title}
          </h2>
          
          {/* Navigation Arrows */}
          {products.length > 4 && (
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`p-2 rounded-full border transition-colors ${
                  canScrollLeft
                    ? 'border-steel-300 hover:border-steel-400 text-athletic-black'
                    : 'border-steel-200 text-steel-400 cursor-not-allowed'
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`p-2 rounded-full border transition-colors ${
                  canScrollRight
                    ? 'border-steel-300 hover:border-steel-400 text-athletic-black'
                    : 'border-steel-200 text-steel-400 cursor-not-allowed'
                }`}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Products Grid/Carousel */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-80">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Scroll Indicators (Mobile) */}
        {products.length > 1 && (
          <div className="flex justify-center mt-6 gap-2 md:hidden">
            {Array.from({ length: Math.ceil(products.length / 2) }).map((_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-steel-300"
              />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
} 