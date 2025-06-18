'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters')
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect') || '/'
  
  const { state, login, clearError } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated && !state.isLoading) {
      router.push(redirectUrl as any)
    }
  }, [state.isAuthenticated, state.isLoading, router, redirectUrl])

  // Clear errors when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true)
      clearError()

      const success = await login(data.email, data.password)
      
      if (success) {
        router.push(redirectUrl as any)
      } else {
        // The auth context will set the error state
        if (state.error) {
          setError('root', { message: state.error })
        }
      }
    } catch (error) {
      setError('root', { 
        message: 'An unexpected error occurred. Please try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading spinner while checking auth state
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-performance-red"></div>
      </div>
    )
  }

  // Don't render login form if already authenticated
  if (state.isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-athletic-black mb-2">
            Welcome Back
          </h1>
          <p className="text-steel-gray">
            Sign in to your FitMarket account
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Global Error Display */}
              {(state.error || errors.root) && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {state.error || errors.root?.message}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" required>
                  Email Address
                </Label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={cn(
                    'block w-full rounded-lg border px-4 py-3 text-athletic-black placeholder-steel-gray shadow-sm transition-all duration-200 focus:outline-none focus:ring-1',
                    errors.email
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-steel-gray focus:border-performance-red focus:ring-performance-red'
                  )}
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" required>
                  Password
                </Label>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className={cn(
                    'block w-full rounded-lg border px-4 py-3 text-athletic-black placeholder-steel-gray shadow-sm transition-all duration-200 focus:outline-none focus:ring-1',
                    errors.password
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-steel-gray focus:border-performance-red focus:ring-performance-red'
                  )}
                  {...register('password')}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <Link 
                  href={"/auth/forgot-password" as any}
                  className="text-sm text-performance-red hover:text-performance-red/80 transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Registration Link */}
              <div className="text-center text-sm text-steel-gray">
                Don't have an account?{' '}
                <Link 
                  href={"/auth/register" as any}
                  className="text-performance-red hover:text-performance-red/80 font-medium transition-colors"
                >
                  Create one here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Back to Home Link */}
        <div className="text-center">
          <Link 
            href="/"
            className="text-sm text-steel-gray hover:text-athletic-black transition-colors"
          >
            ← Back to FitMarket
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-performance-red"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
} 