import { cn } from '@/lib/utils'

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'primary' | 'white' | 'performance'
  className?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  color = 'primary', 
  className 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const colorClasses = {
    primary: 'border-athletic-black border-t-transparent',
    white: 'border-white border-t-transparent',
    performance: 'border-performance-500 border-t-transparent'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2',
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Loading Overlay Component
interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl'
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  className,
  spinnerSize = 'lg'
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner size={spinnerSize} />
        </div>
      )}
    </div>
  )
}

// Skeleton Components
interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
}

export function Skeleton({ className, variant = 'text' }: SkeletonProps) {
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-md'
  }

  return (
    <div
      className={cn(
        'animate-pulse bg-steel-200',
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading content"
    />
  )
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-steel-200 overflow-hidden">
      <Skeleton variant="rectangular" className="aspect-square w-full" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  )
}

// Product Grid Skeleton
interface ProductGridSkeletonProps {
  count?: number
  className?: string
}

export function ProductGridSkeleton({ count = 8, className }: ProductGridSkeletonProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4', className)}>
      {[...Array(count)].map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

// Text Skeleton for different content types
interface TextSkeletonProps {
  lines?: number
  className?: string
}

export function TextSkeleton({ lines = 3, className }: TextSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton 
          key={i} 
          className={cn(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full' // Last line is shorter
          )} 
        />
      ))}
    </div>
  )
}

// Page Header Skeleton
export function PageHeaderSkeleton() {
  return (
    <div className="text-center space-y-4">
      <Skeleton className="h-8 w-64 mx-auto" />
      <Skeleton className="h-4 w-96 mx-auto" />
      <Skeleton className="h-4 w-80 mx-auto" />
    </div>
  )
}

// Cart Item Skeleton
export function CartItemSkeleton() {
  return (
    <div className="bg-white border border-steel-200 rounded-lg p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Skeleton variant="rectangular" className="w-full sm:w-24 h-24 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton variant="rectangular" className="h-8 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

// Button Loading State
interface LoadingButtonProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
}

export function LoadingButton({ 
  isLoading, 
  children, 
  className,
  disabled,
  onClick,
  type = 'button'
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-2',
        className
      )}
    >
      {isLoading && <LoadingSpinner size="sm" color="white" />}
      {children}
    </button>
  )
}

// Full Page Loading Component
export function FullPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-steel-600">Loading...</p>
      </div>
    </div>
  )
} 