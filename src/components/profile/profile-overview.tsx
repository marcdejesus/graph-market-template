'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { useAuth } from '@/lib/auth'
import { useUpdateProfile } from '@/lib/auth/use-auth-mutations'
import { cn } from '@/lib/utils'
import { Edit3, Save, X, User, Mail, Phone, Calendar, MapPin } from 'lucide-react'

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional()
})

type ProfileFormData = z.infer<typeof profileSchema>

export function ProfileOverview() {
  const { state } = useAuth()
  const { updateProfile } = useUpdateProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    watch
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: state.user?.firstName || '',
      lastName: state.user?.lastName || '',
      email: state.user?.email || '',
      phone: '',
      dateOfBirth: '',
      bio: ''
    }
  })

  useEffect(() => {
    if (state.user) {
      reset({
        firstName: state.user.firstName || '',
        lastName: state.user.lastName || '',
        email: state.user.email || '',
        phone: '',
        dateOfBirth: '',
        bio: ''
      })
    }
  }, [state.user, reset])

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form when canceling edit
      if (state.user) {
        reset({
          firstName: state.user.firstName || '',
          lastName: state.user.lastName || '',
          email: state.user.email || '',
          phone: '',
          dateOfBirth: '',
          bio: ''
        })
      }
      setSuccessMessage('')
    }
    setIsEditing(!isEditing)
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true)
      setSuccessMessage('')

      const result = await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName
        // Note: Email updates might require separate verification flow
      })

      if (result.success) {
        setSuccessMessage('Profile updated successfully!')
        setIsEditing(false)
      } else {
        setError('root', { message: result.error || 'Failed to update profile' })
      }
    } catch (error) {
      setError('root', { message: 'An unexpected error occurred. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const watchedValues = watch()

  if (!state.user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-6 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-40"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Manage your personal information and contact details
            </CardDescription>
          </div>
          <Button
            variant={isEditing ? 'outline' : 'outline'}
            onClick={handleEditToggle}
            className="flex items-center space-x-2"
          >
            {isEditing ? (
              <>
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4" />
                <span>Edit</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {errors.root && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-6">
            {errors.root.message}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm mb-6">
            {successMessage}
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <p className="text-xs text-steel-gray">
                Note: Email changes require verification
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="block w-full rounded-lg border border-steel-gray px-4 py-3 text-athletic-black placeholder-steel-gray shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:border-performance-red focus:ring-performance-red"
                  {...register('phone')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <input
                  id="dateOfBirth"
                  type="date"
                  className="block w-full rounded-lg border border-steel-gray px-4 py-3 text-athletic-black shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:border-performance-red focus:ring-performance-red"
                  {...register('dateOfBirth')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <textarea
                id="bio"
                placeholder="Tell us a bit about yourself..."
                rows={4}
                className="block w-full rounded-lg border border-steel-gray px-4 py-3 text-athletic-black placeholder-steel-gray shadow-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:border-performance-red focus:ring-performance-red resize-none"
                {...register('bio')}
              />
              <p className="text-xs text-steel-gray">
                {watchedValues.bio?.length || 0}/500 characters
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleEditToggle}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                loading={isSubmitting}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-performance-red to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {state.user.firstName.charAt(0)}{state.user.lastName.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-athletic-black">
                  {state.user.firstName} {state.user.lastName}
                </h3>
                <p className="text-steel-gray flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {state.user.email}
                </p>
                <p className="text-sm text-green-600 mt-1">✓ Verified Account</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-steel-gray" />
                  <div>
                    <p className="text-sm text-steel-gray">Full Name</p>
                    <p className="font-medium text-athletic-black">
                      {state.user.firstName} {state.user.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-steel-gray" />
                  <div>
                    <p className="text-sm text-steel-gray">Email Address</p>
                    <p className="font-medium text-athletic-black">{state.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-steel-gray" />
                  <div>
                    <p className="text-sm text-steel-gray">Phone Number</p>
                    <p className="font-medium text-athletic-black">Not provided</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-steel-gray" />
                  <div>
                    <p className="text-sm text-steel-gray">Date of Birth</p>
                    <p className="font-medium text-athletic-black">Not provided</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-steel-gray" />
                  <div>
                    <p className="text-sm text-steel-gray">Location</p>
                    <p className="font-medium text-athletic-black">Not provided</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio Section */}
            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-athletic-black mb-3">Bio</h4>
              <p className="text-steel-gray">
                No bio provided yet. Click edit to add a personal description.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 