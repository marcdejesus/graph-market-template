'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useLogout } from '@/lib/auth/use-auth-mutations'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { MainLayout } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { ProfileOverview, ProfileStats, PasswordChangeForm, AccountPreferences } from '@/components/profile'
import { cn } from '@/lib/utils'
import { User, Settings, Shield, Package, LogOut } from 'lucide-react'

type TabKey = 'overview' | 'security' | 'preferences' | 'orders'

interface Tab {
  key: TabKey
  label: string
  icon: React.ReactNode
  component: React.ReactNode
}

function ProfileContent() {
  const { state } = useAuth()
  const { logout } = useLogout()
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  const tabs: Tab[] = [
    {
      key: 'overview',
      label: 'Profile',
      icon: <User className="h-5 w-5" />,
      component: (
        <div className="space-y-6">
          <ProfileStats />
          <ProfileOverview />
        </div>
      )
    },
    {
      key: 'security',
      label: 'Security',
      icon: <Shield className="h-5 w-5" />,
      component: <PasswordChangeForm />
    },
    {
      key: 'preferences',
      label: 'Preferences',
      icon: <Settings className="h-5 w-5" />,
      component: <AccountPreferences />
    },
    {
      key: 'orders',
      label: 'Orders',
      icon: <Package className="h-5 w-5" />,
      component: (
        <Card>
          <CardHeader>
            <CardTitle>Order History</CardTitle>
            <CardDescription>
              View and manage your past orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-steel-gray mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-athletic-black mb-2">
                View Your Orders
              </h3>
              <p className="text-steel-gray mb-6">
                Access detailed order history and tracking information
              </p>
              <Button variant="primary" onClick={() => window.location.href = '/orders'}>
                Go to Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      )
    }
  ]

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await logout()
    }
  }

  const activeTabData = tabs.find(tab => tab.key === activeTab)

  if (!state.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-performance-red mx-auto mb-4"></div>
          <p className="text-steel-gray">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-athletic-black">Account Settings</h1>
                <p className="text-steel-gray mt-2">
                  Manage your profile, security, and preferences
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center space-x-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>

          {/* Tabbed Interface */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3">
              <Card className="sticky top-8">
                <CardContent className="p-0">
                  <nav className="space-y-1">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={cn(
                          'w-full flex items-center space-x-3 px-6 py-4 text-left transition-colors duration-200',
                          activeTab === tab.key
                            ? 'bg-performance-red text-white'
                            : 'text-steel-gray hover:bg-gray-50 hover:text-athletic-black'
                        )}
                      >
                        {tab.icon}
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="mt-6 lg:mt-0 lg:col-span-9">
              <div className="space-y-6">
                {/* Mobile Tab Header */}
                <div className="lg:hidden">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        {activeTabData?.icon}
                        <CardTitle>{activeTabData?.label}</CardTitle>
                      </div>
                    </CardHeader>
                  </Card>
                </div>

                {/* Tab Content */}
                {activeTabData?.component}
              </div>
            </div>
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