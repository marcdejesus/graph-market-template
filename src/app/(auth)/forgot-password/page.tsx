'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth'
import { useForgotPassword } from '@/lib/auth/use-auth-mutations'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

// Validation schema
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { state, clearError } = useAuth()
  const { forgotPassword, loading: _forgotPasswordLoading } = useForgotPassword()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
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

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true)
      clearError()

      const result = await forgotPassword(data.email)

      if (result.success) {
        // Email sent successfully
        setIsEmailSent(true)
      } else {
        setError('root', { message: result.error || 'Failed to send reset email' })
      }
    } catch (error) {
      setError('root', { 
        message: 'An unexpected error occurred. Please try again.' 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResendEmail = async () => {
    const email = getValues('email')
    if (email) {
      await onSubmit({ email })
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

  // Don't render forgot password form if already authenticated
  if (state.isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-athletic-black mb-2">
            {isEmailSent ? 'Check Your Email' : 'Reset Password'}
          </h1>
          <p className="text-steel-gray">
            {isEmailSent 
              ? "We've sent you a password reset link"
              : "Enter your email to receive a reset link"
            }
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>
              {isEmailSent ? 'Email Sent!' : 'Forgot Password?'}
            </CardTitle>
            <CardDescription>
              {isEmailSent 
                ? 'Check your inbox and follow the instructions to reset your password'
                : 'No worries, we\'ll send you reset instructions'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {isEmailSent ? (
              <div className="space-y-6">
                {/* Success State */}
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm text-center">
                  Password reset instructions have been sent to your email address.
                </div>

                <div className="text-center space-y-4">
                  <p className="text-sm text-steel-gray">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  
                  <Button
                    variant="outline"
                    onClick={handleResendEmail}
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? 'Sending...' : 'Resend Email'}
                  </Button>
                </div>
              </div>
            ) : (
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
                    placeholder="Enter your email address"
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
                </Button>
              </form>
            )}

            {/* Navigation Links */}
            <div className="mt-6 space-y-4">
              <div className="text-center text-sm text-steel-gray">
                Remember your password?{' '}
                <Link 
                  href={"/auth/login" as any}
                  className="text-performance-red hover:text-performance-red/80 font-medium transition-colors"
                >
                  Sign in here
                </Link>
              </div>

              {!isEmailSent && (
                <div className="text-center text-sm text-steel-gray">
                  Don't have an account?{' '}
                  <Link 
                    href={"/auth/register" as any}
                    className="text-performance-red hover:text-performance-red/80 font-medium transition-colors"
                  >
                    Create one here
                  </Link>
                </div>
              )}
            </div>
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