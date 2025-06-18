'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth'
import { useRegister } from '@/lib/auth/use-auth-mutations'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Validation schema
const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { state, clearError } = useAuth()
  const { register: registerUser, loading: _registerLoading } = useRegister()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  })

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated && !state.isLoading) {
      router.push('/' as any)
    }
  }, [state.isAuthenticated, state.isLoading, router])

  // Clear errors when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsSubmitting(true)
      clearError()

      const result = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password
      })

      if (result.success) {
        // Registration successful - redirect to login
        router.push('/auth/login?message=Registration successful! Please sign in.' as any)
      } else {
        setError('root', { message: result.error || 'Registration failed' })
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

  // Don't render register form if already authenticated
  if (state.isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-athletic-black mb-2">
            Join FitMarket
          </h1>
          <p className="text-steel-gray">
            Create your account to start shopping premium athletic wear
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Fill in your information to get started
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

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" required>
                    First Name
                  </Label>
                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="First name"
                    className={cn(
                      'block w-full rounded-lg border px-4 py-3 text-athletic-black placeholder-steel-gray shadow-sm transition-all duration-200 focus:outline-none focus:ring-1',
                      errors.firstName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-steel-gray focus:border-performance-red focus:ring-performance-red'
                    )}
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600" role="alert">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" required>
                    Last Name
                  </Label>
                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="Last name"
                    className={cn(
                      'block w-full rounded-lg border px-4 py-3 text-athletic-black placeholder-steel-gray shadow-sm transition-all duration-200 focus:outline-none focus:ring-1',
                      errors.lastName
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-steel-gray focus:border-performance-red focus:ring-performance-red'
                    )}
                    {...register('lastName')}
                  />
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600" role="alert">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

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
                  autoComplete="new-password"
                  placeholder="Create a password"
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
                <p className="text-xs text-steel-gray mt-1">
                  Must contain at least 8 characters with uppercase, lowercase, and numbers
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" required>
                  Confirm Password
                </Label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  className={cn(
                    'block w-full rounded-lg border px-4 py-3 text-athletic-black placeholder-steel-gray shadow-sm transition-all duration-200 focus:outline-none focus:ring-1',
                    errors.confirmPassword
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                      : 'border-steel-gray focus:border-performance-red focus:ring-performance-red'
                  )}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                className="w-full"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>

              {/* Login Link */}
              <div className="text-center text-sm text-steel-gray">
                Already have an account?{' '}
                <Link 
                  href={"/auth/login" as any}
                  className="text-performance-red hover:text-performance-red/80 font-medium transition-colors"
                >
                  Sign in here
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