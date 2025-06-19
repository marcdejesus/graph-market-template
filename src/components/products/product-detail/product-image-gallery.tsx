'use client'

import { useState } from 'react'
import { ProductImage } from '@/types'
import { ResponsiveImage } from '@/components/ui/image'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { Modal } from '@/components/ui/modal'

interface ProductImageGalleryProps {
  images: ProductImage[]
  productName: string
  className?: string
}

export function ProductImageGallery({ images, productName, className = '' }: ProductImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false)

  const handlePrevious = () => {
    setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNext = () => {
    setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  const openZoomModal = () => {
    setIsZoomModalOpen(true)
  }

  if (!images.length) {
    return (
      <div className={`bg-steel-100 rounded-lg flex items-center justify-center h-96 ${className}`}>
        <span className="text-steel-500">No images available</span>
      </div>
    )
  }

  const currentImage = images[selectedImageIndex]

  if (!currentImage) {
    return (
      <div className={`bg-steel-100 rounded-lg flex items-center justify-center h-96 ${className}`}>
        <span className="text-steel-500">No images available</span>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="relative group bg-steel-50 rounded-lg overflow-hidden">
        <div className="aspect-square relative">
          <ResponsiveImage
            src={currentImage.url}
            alt={currentImage.altText || `${productName} - Image ${selectedImageIndex + 1}`}
            aspectRatio="square"
            objectFit="cover"
            priority={selectedImageIndex === 0}
            containerClassName="w-full h-full"
            className="w-full h-full"
          />
          
          {/* Zoom Button */}
          <button
            onClick={openZoomModal}
            className="absolute top-4 right-4 bg-white/80 hover:bg-white text-athletic-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Zoom image"
          >
            <ZoomIn className="h-5 w-5" />
          </button>

          {/* Navigation Arrows (only show if multiple images) */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-athletic-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-athletic-black p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                index === selectedImageIndex
                  ? 'border-performance-500'
                  : 'border-steel-200 hover:border-steel-300'
              }`}
            >
              <ResponsiveImage
                src={image.url}
                alt={`${productName} thumbnail ${index + 1}`}
                width={80}
                height={80}
                aspectRatio="square"
                objectFit="cover"
                className="w-full h-full"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      <Modal
        isOpen={isZoomModalOpen}
        onClose={() => setIsZoomModalOpen(false)}
        size="full"
      >
        <div className="relative w-full h-full bg-black flex items-center justify-center">
          <div className="relative max-w-5xl max-h-full">
            <ResponsiveImage
              src={currentImage.url}
              alt={currentImage.altText || `${productName} - Large view`}
              width={1200}
              height={1200}
              objectFit="contain"
              className="max-w-full max-h-full"
            />
          </div>
          
          {/* Close Button */}
          <button
            onClick={() => setIsZoomModalOpen(false)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
          >
            <ChevronLeft className="h-6 w-6 rotate-45" />
          </button>

          {/* Navigation in zoom mode */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image counter in zoom mode */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full">
            {selectedImageIndex + 1} / {images.length}
          </div>
        </div>
      </Modal>
    </div>
  )
} 