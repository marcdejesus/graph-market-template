'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { SearchBar } from '@/components/layout/search-bar'
import { CategoryNavigation } from '@/components/navigation/category-navigation'
import { useAuth } from '@/lib/auth'
import { useCartContext } from '@/context/cart-context'
import { useLogout } from '@/lib/auth/use-auth-mutations'

// Navigation is now handled by CategoryNavigation component

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { state } = useAuth()
  const { logout } = useLogout()
  const cartContext = useCartContext()
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
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={() => router.push('/cart' as any)}
                disabled={cartContext.state.isLoading}
              >
                <div className="relative">
                  <ShoppingBagIcon className="h-5 w-5" />
                  {/* Loading indicator */}
                  {cartContext.state.isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-3 h-3 border-2 border-performance-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                <span className="sr-only">Shopping cart</span>
                
                {/* Cart count badge */}
                {cartContext.state.totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-performance-500 text-xs text-white flex items-center justify-center">
                    {cartContext.state.totalItems > 99 ? '99+' : cartContext.state.totalItems}
                  </span>
                )}
                
                {/* Sync status indicators */}
                {!cartContext.state.isOnline && (
                  <span className="absolute -bottom-1 -left-1 h-3 w-3 rounded-full bg-amber-500 border border-white" title="Offline - changes will sync when online">
                    <span className="sr-only">Offline</span>
                  </span>
                )}
                
                {cartContext.state.error && (
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-red-500 border border-white" title={cartContext.state.error}>
                    <span className="sr-only">Error</span>
                  </span>
                )}
              </Button>
              
              {/* Enhanced cart tooltip for development */}
              {process.env.NODE_ENV === 'development' && cartContext.state.totalItems > 0 && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-steel-200 z-50 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none hover:pointer-events-auto">
                  <div className="p-3">
                    <div className="text-xs font-medium text-athletic-black mb-2">Cart Summary (Dev)</div>
                    <div className="space-y-1 text-xs text-steel-gray">
                      <div>Items: {cartContext.state.totalItems}</div>
                      <div>Total: ${cartContext.state.totalAmount.toFixed(2)}</div>
                      <div>Status: {cartContext.state.isLoading ? 'Syncing...' : 'Ready'}</div>
                      <div>Online: {cartContext.state.isOnline ? 'Yes' : 'No'}</div>
                      {cartContext.state.lastSyncedAt && (
                        <div>Last sync: {cartContext.state.lastSyncedAt.toLocaleTimeString()}</div>
                      )}
                      {cartContext.state.error && (
                        <div className="text-red-600">Error: {cartContext.state.error}</div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

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
            {state.isAuthenticated ? (
              <div className="border-t border-steel-200 pt-4 px-3">
                <div className="space-y-2">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-athletic-black hover:bg-steel-50 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      router.push('/orders' as any)
                      setMobileMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-athletic-black hover:bg-steel-50 rounded-lg transition-colors"
                  >
                    Order History
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-steel-200 pt-4 px-3">
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1"
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
                    className="flex-1"
                    onClick={() => {
                      router.push('/auth/register' as any)
                      setMobileMenuOpen(false)
                    }}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}

// Icon Components
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
      {isOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  )
} 