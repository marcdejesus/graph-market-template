'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Mail, MessageSquare, Shield, Palette } from 'lucide-react'

const preferencesSchema = z.object({
  // Email Notifications
  orderUpdates: z.boolean(),
  promotionalEmails: z.boolean(),
  productRecommendations: z.boolean(),
  newsletterSubscription: z.boolean(),
  
  // SMS Notifications
  smsOrderUpdates: z.boolean(),
  smsPromotions: z.boolean(),
  
  // Account Settings
  twoFactorAuth: z.boolean(),
  sessionTimeout: z.enum(['15', '30', '60', 'never']),
  
  // Display Preferences
  language: z.enum(['en', 'es', 'fr']),
  currency: z.enum(['USD', 'EUR', 'GBP', 'CAD']),
  theme: z.enum(['light', 'dark', 'auto']),
  
  // Privacy Settings
  profileVisibility: z.enum(['public', 'private']),
  shareDataForAnalytics: z.boolean(),
  trackingCookies: z.boolean()
})

type PreferencesFormData = z.infer<typeof preferencesSchema>

interface ToggleSwitchProps {
  id: string
  label: string
  description?: string
  checked: boolean
  onChange: (_checked: boolean) => void
}

function ToggleSwitch({ id, label, description, checked, onChange }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <Label htmlFor={id} className="text-sm font-medium text-athletic-black">
          {label}
        </Label>
        {description && (
          <p className="text-sm text-steel-gray mt-1">{description}</p>
        )}
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-performance-red focus:ring-offset-2',
          checked 
            ? 'bg-performance-red' 
            : 'bg-gray-200'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
    </div>
  )
}

export function AccountPreferences() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    setValue
  } = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      // Email Notifications (default enabled)
      orderUpdates: true,
      promotionalEmails: false,
      productRecommendations: false,
      newsletterSubscription: false,
      
      // SMS Notifications (default disabled)
      smsOrderUpdates: false,
      smsPromotions: false,
      
      // Account Settings
      twoFactorAuth: false,
      sessionTimeout: '30',
      
      // Display Preferences
      language: 'en',
      currency: 'USD',
      theme: 'light',
      
      // Privacy Settings
      profileVisibility: 'private',
      shareDataForAnalytics: false,
      trackingCookies: true
    }
  })

  const watchedValues = watch()

  const onSubmit = async (data: PreferencesFormData) => {
    try {
      setIsSubmitting(true)
      setSuccessMessage('')

      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real implementation, you would save preferences to backend
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log('Saving preferences:', data)
      }
      
      setSuccessMessage('Preferences saved successfully!')
    } catch (error) {
      setError('root', { message: 'Failed to save preferences. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {errors.root && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {errors.root.message}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-performance-red" />
              <CardTitle>Email Notifications</CardTitle>
            </div>
            <CardDescription>
              Choose which email notifications you'd like to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ToggleSwitch
              id="orderUpdates"
              label="Order Updates"
              description="Notifications about your order status and shipping"
              checked={watchedValues.orderUpdates}
              onChange={(checked) => setValue('orderUpdates', checked)}
            />
            <ToggleSwitch
              id="promotionalEmails"
              label="Promotional Emails"
              description="Special offers, sales, and discounts"
              checked={watchedValues.promotionalEmails}
              onChange={(checked) => setValue('promotionalEmails', checked)}
            />
            <ToggleSwitch
              id="productRecommendations"
              label="Product Recommendations"
              description="Personalized product suggestions based on your preferences"
              checked={watchedValues.productRecommendations}
              onChange={(checked) => setValue('productRecommendations', checked)}
            />
            <ToggleSwitch
              id="newsletterSubscription"
              label="Newsletter"
              description="Weekly newsletter with fitness tips and new arrivals"
              checked={watchedValues.newsletterSubscription}
              onChange={(checked) => setValue('newsletterSubscription', checked)}
            />
          </CardContent>
        </Card>

        {/* SMS Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-performance-red" />
              <CardTitle>SMS Notifications</CardTitle>
            </div>
            <CardDescription>
              Receive important updates via text message
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <ToggleSwitch
              id="smsOrderUpdates"
              label="Order Updates"
              description="Text notifications for order and shipping updates"
              checked={watchedValues.smsOrderUpdates}
              onChange={(checked) => setValue('smsOrderUpdates', checked)}
            />
            <ToggleSwitch
              id="smsPromotions"
              label="Promotional SMS"
              description="Text messages about sales and special offers"
              checked={watchedValues.smsPromotions}
              onChange={(checked) => setValue('smsPromotions', checked)}
            />
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-performance-red" />
              <CardTitle>Security & Privacy</CardTitle>
            </div>
            <CardDescription>
              Manage your account security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleSwitch
              id="twoFactorAuth"
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
              checked={watchedValues.twoFactorAuth}
              onChange={(checked) => setValue('twoFactorAuth', checked)}
            />
            
            <div className="space-y-2">
              <Label htmlFor="sessionTimeout">Session Timeout</Label>
              <select
                id="sessionTimeout"
                className="block w-full rounded-lg border border-steel-gray px-4 py-3 text-athletic-black focus:border-performance-red focus:outline-none focus:ring-1 focus:ring-performance-red"
                {...register('sessionTimeout')}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="never">Never</option>
              </select>
            </div>

            <ToggleSwitch
              id="shareDataForAnalytics"
              label="Share Data for Analytics"
              description="Help us improve by sharing anonymous usage data"
              checked={watchedValues.shareDataForAnalytics}
              onChange={(checked) => setValue('shareDataForAnalytics', checked)}
            />
            
            <ToggleSwitch
              id="trackingCookies"
              label="Tracking Cookies"
              description="Allow cookies for personalized experience"
              checked={watchedValues.trackingCookies}
              onChange={(checked) => setValue('trackingCookies', checked)}
            />
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-performance-red" />
              <CardTitle>Display Preferences</CardTitle>
            </div>
            <CardDescription>
              Customize your shopping experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  className="block w-full rounded-lg border border-steel-gray px-4 py-3 text-athletic-black focus:border-performance-red focus:outline-none focus:ring-1 focus:ring-performance-red"
                  {...register('language')}
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select
                  id="currency"
                  className="block w-full rounded-lg border border-steel-gray px-4 py-3 text-athletic-black focus:border-performance-red focus:outline-none focus:ring-1 focus:ring-performance-red"
                  {...register('currency')}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD (C$)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <select
                id="theme"
                className="block w-full rounded-lg border border-steel-gray px-4 py-3 text-athletic-black focus:border-performance-red focus:outline-none focus:ring-1 focus:ring-performance-red"
                {...register('theme')}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            loading={isSubmitting}
          >
            {isSubmitting ? 'Saving Preferences...' : 'Save Preferences'}
          </Button>
        </div>
      </form>
    </div>
  )
} 