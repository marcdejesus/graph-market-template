'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'

interface ProtectedRouteProps {
  children: ReactNode
  fallback?: ReactNode
  redirectTo?: string
  requireAuth?: boolean
}

export function ProtectedRoute({ 
  children, 
  fallback,
  redirectTo = '/auth/login',
  requireAuth = true 
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { state } = useAuth()

  useEffect(() => {
    // Wait for auth state to be determined
    if (state.isLoading) return

    if (requireAuth && !state.isAuthenticated) {
      // Redirect to login with current path for return redirect
      const redirectUrl = `${redirectTo}?redirect=${encodeURIComponent(pathname)}`
      router.push(redirectUrl as any)
    }
  }, [state.isAuthenticated, state.isLoading, requireAuth, router, pathname, redirectTo])

  // Show loading state while auth is being determined
  if (state.isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-performance-red mx-auto"></div>
          <p className="text-steel-gray">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render children if auth is required but user is not authenticated
  if (requireAuth && !state.isAuthenticated) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-steel-gray">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  // If auth is not required or user is authenticated, render children
  return <>{children}</>
}

// Higher-order component for protecting pages
export function withProtectedRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedPage(props: P) {
    return (
      <ProtectedRoute {...options}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    )
  }
} 