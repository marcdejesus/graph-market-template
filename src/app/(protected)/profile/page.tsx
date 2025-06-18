'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/lib/auth'
import { useUpdateProfile, useLogout } from '@/lib/auth/use-auth-mutations'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address')
})

type ProfileFormData = z.infer<typeof profileSchema>

function ProfileContent() {
  const { state } = useAuth()
  const { updateProfile, loading: _updateLoading } = useUpdateProfile()
  const { logout } = useLogout()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: state.user?.firstName || '',
      lastName: state.user?.lastName || '',
      email: state.user?.email || ''
    }
  })

  useEffect(() => {
    if (state.user) {
      reset({
        firstName: state.user.firstName || '',
        lastName: state.user.lastName || '',
        email: state.user.email || ''
      })
    }
  }, [state.user, reset])

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)

      const result = await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName
        // Note: Email updates might require separate verification flow
      })

      if (result.success) {
        alert('Profile updated successfully!')
      } else {
        setError('root', { message: result.error || 'Failed to update profile' })
      }
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await logout()
    }
  }

  if (!state.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-steel-gray">Loading profile...</p>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-athletic-black">My Profile</h1>
            <p className="text-steel-gray mt-2">Manage your account information</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and email address</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {errors.root && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                      {errors.root.message}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" required>First Name</Label>
                      <input
                        id="firstName"
                        type="text"
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
                      <Label htmlFor="lastName" required>Last Name</Label>
                      <input
                        id="lastName"
                        type="text"
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

                  <div className="space-y-2">
                    <Label htmlFor="email" required>Email Address</Label>
                    <input
                      id="email"
                      type="email"
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

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                    >
                      {isSubmitting ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center text-red-600 border-red-300 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
} 