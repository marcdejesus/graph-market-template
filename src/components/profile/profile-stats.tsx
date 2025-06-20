'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/auth'
import { Package, Heart, ShoppingBag, Trophy, Calendar, Star } from 'lucide-react'

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  description?: string
  colorClass?: string
}

function StatCard({ icon, label, value, description, colorClass = 'text-performance-red' }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full bg-gray-50 ${colorClass}`}>
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-athletic-black">{value}</p>
            <p className="text-sm font-medium text-steel-gray">{label}</p>
            {description && (
              <p className="text-xs text-steel-gray mt-1">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ProfileStats() {
  const { state } = useAuth()

  // Mock data - in real app, this would come from API
  const stats = {
    totalOrders: 12,
    totalSpent: 1249.99,
    favoriteItems: 8,
    loyaltyPoints: 450,
    memberSince: new Date('2023-06-15'),
    averageRating: 4.8
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatMemberSince = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  const calculateMembershipLength = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const diffMonths = Math.floor(diffDays / 30)
    
    if (diffMonths < 1) {
      return 'New member'
    } else if (diffMonths < 12) {
      return `${diffMonths} month${diffMonths === 1 ? '' : 's'}`
    } else {
      const years = Math.floor(diffMonths / 12)
      return `${years} year${years === 1 ? '' : 's'}`
    }
  }

  if (!state.user) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 rounded-full bg-gray-200 w-14 h-14"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-performance-red to-red-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Welcome back, {state.user.firstName}!
            </h2>
            <p className="text-red-100 mt-1">
              Member since {formatMemberSince(stats.memberSince)} • {calculateMembershipLength(stats.memberSince)}
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
              <Trophy className="h-8 w-8" />
            </div>
            <p className="text-sm mt-2">Elite Member</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<Package className="h-6 w-6" />}
          label="Total Orders"
          value={stats.totalOrders}
          description="Completed purchases"
          colorClass="text-performance-red"
        />
        
        <StatCard
          icon={<ShoppingBag className="h-6 w-6" />}
          label="Total Spent"
          value={formatCurrency(stats.totalSpent)}
          description="All-time purchases"
          colorClass="text-green-600"
        />
        
        <StatCard
          icon={<Heart className="h-6 w-6" />}
          label="Favorite Items"
          value={stats.favoriteItems}
          description="Saved products"
          colorClass="text-pink-600"
        />
        
        <StatCard
          icon={<Trophy className="h-6 w-6" />}
          label="Loyalty Points"
          value={stats.loyaltyPoints}
          description="Available to redeem"
          colorClass="text-yellow-600"
        />
        
        <StatCard
          icon={<Calendar className="h-6 w-6" />}
          label="Member Since"
          value={formatMemberSince(stats.memberSince)}
          description={calculateMembershipLength(stats.memberSince)}
          colorClass="text-blue-600"
        />
        
        <StatCard
          icon={<Star className="h-6 w-6" />}
          label="Average Rating"
          value={`${stats.averageRating}/5`}
          description="Your reviews"
          colorClass="text-purple-600"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-athletic-black mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-performance-red hover:bg-red-50 transition-colors">
              <Package className="h-5 w-5 text-performance-red" />
              <div className="text-left">
                <p className="font-medium text-athletic-black">View Orders</p>
                <p className="text-sm text-steel-gray">Track your purchases</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-performance-red hover:bg-red-50 transition-colors">
              <Heart className="h-5 w-5 text-performance-red" />
              <div className="text-left">
                <p className="font-medium text-athletic-black">Wishlist</p>
                <p className="text-sm text-steel-gray">View saved items</p>
              </div>
            </button>
            
            <button className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 hover:border-performance-red hover:bg-red-50 transition-colors">
              <Trophy className="h-5 w-5 text-performance-red" />
              <div className="text-left">
                <p className="font-medium text-athletic-black">Rewards</p>
                <p className="text-sm text-steel-gray">Redeem points</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 