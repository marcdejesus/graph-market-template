'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { SearchBar } from '@/components/layout/search-bar'
import { CategoryNavigation } from '@/components/navigation/category-navigation'
import { useAuth } from '@/lib/auth'
import { useCart } from '@/hooks/useCart'
import { useLogout } from '@/lib/auth/use-auth-mutations'

// Navigation is now handled by CategoryNavigation component

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { state } = useAuth()
  const { logout } = useLogout()
  const { cart } = useCart()
  const router = useRouter()

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await logout()
      setUserMenuOpen(false)
    }
  }

  return (
    <header className="bg-white shadow-athletic sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bebas font-bold text-primary-900">
                FitMarket
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center">
            <CategoryNavigation variant="header" />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block md:w-80 lg:w-96">
            <SearchBar placeholder="Search for products..." />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">

            {/* User Account */}
            {state.isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2"
                >
                  <UserIcon className="h-5 w-5" />
                  <span className="hidden md:inline text-sm font-medium">
                    {state.user?.firstName || 'Account'}
                  </span>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-steel-200 z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-steel-100">
                        <p className="text-sm font-medium text-athletic-black">
                          {state.user?.firstName} {state.user?.lastName}
                        </p>
                        <p className="text-xs text-steel-gray">{state.user?.email}</p>
                      </div>
                      
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-athletic-black hover:bg-steel-50 transition-colors"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      
                      <button
                        onClick={() => {
                          router.push('/orders' as any)
                          setUserMenuOpen(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-athletic-black hover:bg-steel-50 transition-colors"
                      >
                        Order History
                      </button>
                      
                      <div className="border-t border-steel-100">
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/auth/login' as any)}
                >
                  Sign In
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => router.push('/auth/register' as any)}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Shopping Cart */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              onClick={() => router.push('/cart' as any)}
            >
              <ShoppingBagIcon className="h-5 w-5" />
              <span className="sr-only">Shopping cart</span>
              {/* Cart count badge */}
              {cart.totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-performance-500 text-xs text-white flex items-center justify-center">
                  {cart.totalItems > 99 ? '99+' : cart.totalItems}
                </span>
              )}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <HamburgerIcon className="h-5 w-5" isOpen={mobileMenuOpen} />
              <span className="sr-only">{mobileMenuOpen ? 'Close menu' : 'Open menu'}</span>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          'lg:hidden transition-all duration-300 ease-in-out',
          mobileMenuOpen 
            ? 'max-h-[500px] opacity-100 pb-4' 
            : 'max-h-0 opacity-0 overflow-hidden'
        )}>
          <div className="border-t border-steel-200 pt-4">
            {/* Mobile Search */}
            <div className="px-3 mb-4">
              <SearchBar placeholder="Search..." isMobile={true} />
            </div>
            
            {/* Navigation Links */}
            <div>
              <CategoryNavigation 
                variant="mobile" 
                onLinkClick={() => setMobileMenuOpen(false)} 
              />
            </div>

            {/* Mobile User Actions */}
            {!state.isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-steel-200 space-y-2 px-3">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    router.push('/auth/login' as any)
                    setMobileMenuOpen(false)
                  }}
                >
                  Sign In
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    router.push('/auth/register' as any)
                    setMobileMenuOpen(false)
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile User Menu for Authenticated Users */}
            {state.isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-steel-200 px-3">
                <div className="mb-3 pb-3 border-b border-steel-100">
                  <p className="text-sm font-medium text-athletic-black">
                    {state.user?.firstName} {state.user?.lastName}
                  </p>
                  <p className="text-xs text-steel-gray">{state.user?.email}</p>
                </div>
                
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    className="block py-2 text-sm text-athletic-black hover:text-performance-500 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  
                  <button
                    onClick={() => {
                      router.push('/orders' as any)
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left py-2 text-sm text-athletic-black hover:text-performance-500 transition-colors"
                  >
                    Order History
                  </button>
                  
                  <button
                    onClick={() => {
                      handleLogout()
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left py-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

// Simple SVG icons

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function ShoppingBagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
    </svg>
  )
}

function HamburgerIcon({ className, isOpen }: { className?: string; isOpen: boolean }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
        className="transition-all duration-200"
      />
    </svg>
  )
} 