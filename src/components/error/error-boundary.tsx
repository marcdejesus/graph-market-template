'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (_error: Error, _errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)

    // In production, you might want to log this to an error reporting service
    // Example: Sentry.captureException(error, { contexts: { react: errorInfo } })
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default error UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <DefaultErrorFallback error={this.state.error} onReset={this.handleReset} onReload={this.handleReload} />
    }

    return this.props.children
  }
}

// Default Error Fallback Component
interface DefaultErrorFallbackProps {
  error?: Error
  onReset: () => void
  onReload: () => void
}

function DefaultErrorFallback({ error, onReset, onReload }: DefaultErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-steel-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Error Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bebas font-bold text-athletic-black mb-2">
            Something went wrong
          </h1>
          
          <p className="text-steel-600 mb-6">
            We're sorry, but something unexpected happened. Please try again.
          </p>

          {/* Error Details in Development */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mb-6 text-left">
              <summary className="cursor-pointer text-sm font-medium text-steel-700 mb-2">
                Error Details (Development)
              </summary>
              <div className="bg-steel-100 rounded-md p-3 text-xs font-mono text-steel-800 overflow-auto max-h-32">
                <div className="text-red-600 font-semibold mb-1">{error.name}</div>
                <div className="mb-2">{error.message}</div>
                {error.stack && (
                  <pre className="whitespace-pre-wrap break-words">{error.stack}</pre>
                )}
              </div>
            </details>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              variant="primary" 
              onClick={onReset}
              className="flex-1 sm:flex-none"
            >
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={onReload}
              className="flex-1 sm:flex-none"
            >
              Reload Page
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-steel-200">
            <p className="text-sm text-steel-500">
              If this problem persists, please{' '}
              <a 
                href="/contact" 
                className="text-performance-500 hover:text-performance-600 transition-colors"
              >
                contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Async Error Boundary Hook for handling async errors
export function useAsyncError() {
  const [_, setError] = React.useState()
  
  return React.useCallback(
    (error: Error) => {
      setError(() => {
        throw error
      })
    },
    []
  )
}

// Component Error Fallback for smaller sections
interface ComponentErrorFallbackProps {
  error?: Error
  onRetry?: () => void
  className?: string
  title?: string
  description?: string
}

export function ComponentErrorFallback({ 
  error, 
  onRetry, 
  className = '',
  title = 'Unable to load content',
  description = 'Something went wrong loading this section.'
}: ComponentErrorFallbackProps) {
  return (
    <div className={`text-center py-8 px-4 ${className}`}>
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-athletic-black mb-2">
        {title}
      </h3>
      
      <p className="text-steel-600 mb-4">
        {description}
      </p>

      {process.env.NODE_ENV === 'development' && error && (
        <details className="mb-4 text-left max-w-md mx-auto">
          <summary className="cursor-pointer text-sm font-medium text-steel-700 mb-2">
            Error Details
          </summary>
          <div className="bg-steel-100 rounded-md p-3 text-xs font-mono text-steel-800 overflow-auto max-h-24">
            {error.message}
          </div>
        </details>
      )}

      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  )
} 