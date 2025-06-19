'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

// Responsive Image Wrapper Component
interface ResponsiveImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  aspectRatio?: 'square' | '4/3' | '16/9' | '3/2' | '2/1'
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  priority?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  fallbackSrc?: string
  className?: string
  containerClassName?: string
  quality?: number
  sizes?: string
  loading?: 'lazy' | 'eager'
  onLoad?: () => void
  onError?: () => void
}

export function ResponsiveImage({
  src,
  alt,
  width,
  height,
  aspectRatio,
  objectFit = 'cover',
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  fallbackSrc = '/images/placeholder.jpg',
  className,
  containerClassName,
  quality = 75,
  sizes,
  loading = 'lazy',
  onLoad,
  onError
}: ResponsiveImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const aspectRatioClasses = {
    'square': 'aspect-square',
    '4/3': 'aspect-[4/3]',
    '16/9': 'aspect-video',
    '3/2': 'aspect-[3/2]',
    '2/1': 'aspect-[2/1]'
  }

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    setIsLoading(false)
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
    }
    onError?.()
  }

  // Container classes
  const containerClasses = cn(
    'relative overflow-hidden bg-steel-100',
    aspectRatio && aspectRatioClasses[aspectRatio],
    containerClassName
  )

  // Image classes
  const imageClasses = cn(
    'transition-opacity duration-300',
    isLoading && 'opacity-0',
    !isLoading && 'opacity-100',
    className
  )

  return (
    <div className={containerClasses}>
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-steel-200 animate-pulse flex items-center justify-center">
          <div className="text-steel-400">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )}

      <Image
        src={imageSrc}
        alt={alt}
        fill={!width || !height}
        width={width}
        height={height}
        className={imageClasses}
        style={{
          objectFit: objectFit,
        }}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        quality={quality}
        sizes={sizes}
        {...(!priority && { loading })}
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Error state */}
      {hasError && imageSrc === fallbackSrc && (
        <div className="absolute inset-0 bg-steel-100 flex items-center justify-center">
          <div className="text-center text-steel-500">
            <svg className="h-12 w-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-sm">Image not available</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Product Image Component (specific for product cards)
interface ProductImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  sizes?: string
}

export function ProductImage({ 
  src, 
  alt, 
  className, 
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
}: ProductImageProps) {
  return (
    <ResponsiveImage
      src={src}
      alt={alt}
      aspectRatio="square"
      objectFit="cover"
      priority={priority}
      sizes={sizes}
      className={className}
      containerClassName="group-hover:scale-105 transition-transform duration-300"
      quality={80}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyyrfMyyneSEGjdMLNRUVTu/qewbkaTjwzU9TbHNXTwYQrHlC83QvbR/gx3Bvuj5NjO7RYz6nqkTaHUnKi3KEUo4H6PIv8AJMiRo0aZTvhpKtJ1aNXdOihWXJLN1DvFgXo="
    />
  )
}

// Avatar Image Component
interface AvatarImageProps {
  src?: string
  alt: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fallbackInitials?: string
  className?: string
}

export function AvatarImage({ 
  src, 
  alt, 
  size = 'md',
  fallbackInitials,
  className 
}: AvatarImageProps) {
  const [hasError, setHasError] = useState(false)

  const sizeClasses = {
    xs: 'h-6 w-6 text-xs',
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
    xl: 'h-16 w-16 text-xl'
  }

  const handleError = () => {
    setHasError(true)
  }

  if (!src || hasError) {
    return (
      <div className={cn(
        'flex items-center justify-center rounded-full bg-steel-200 text-steel-600 font-medium',
        sizeClasses[size],
        className
      )}>
        {fallbackInitials || alt.charAt(0).toUpperCase()}
      </div>
    )
  }

  return (
    <div className={cn('relative rounded-full overflow-hidden', sizeClasses[size], className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={handleError}
        sizes="(max-width: 64px) 100vw"
      />
    </div>
  )
}

// Hero Image Component for banners/heroes
interface HeroImageProps {
  src: string
  alt: string
  className?: string
  priority?: boolean
  overlay?: boolean
  overlayOpacity?: number
}

export function HeroImage({ 
  src, 
  alt, 
  className,
  priority = true,
  overlay = false,
  overlayOpacity = 0.3
}: HeroImageProps) {
  return (
    <div className={cn('relative w-full', className)}>
      <ResponsiveImage
        src={src}
        alt={alt}
        aspectRatio="16/9"
        objectFit="cover"
        priority={priority}
        sizes="100vw"
        quality={85}
      />
      {overlay && (
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      )}
    </div>
  )
}

// Gallery Image Component
interface GalleryImageProps {
  src: string
  alt: string
  thumbnail?: string
  className?: string
  onImageClick?: () => void
}

export function GalleryImage({ 
  src, 
  alt, 
  thumbnail,
  className,
  onImageClick
}: GalleryImageProps) {
  return (
    <div 
      className={cn('cursor-pointer group', className)}
      onClick={onImageClick}
    >
      <ResponsiveImage
        src={thumbnail || src}
        alt={alt}
        aspectRatio="square"
        objectFit="cover"
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        containerClassName="group-hover:opacity-80 transition-opacity duration-200"
      />
    </div>
  )
} 