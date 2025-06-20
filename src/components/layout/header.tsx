'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { SearchBar } from '@/components/layout/search-bar'
import { CategoryNavigation } from '@/components/navigation/category-navigation'
import { useAuth } from '@/lib/auth'
import { useLogout } from '@/lib/auth/use-auth-mutations'
import { CartIcon } from '@/components/cart/cart-icon'
import { CartDrawer } from '@/components/cart/cart-drawer'

// Navigation is now handled by CategoryNavigation component

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { state } = useAuth()
  const { logout } = useLogout()
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
    <>
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
              <CartIcon 
                onClick={() => setCartDrawerOpen(true)}
                className="hover:bg-gray-50 rounded-md"
              />

              {/* Mobile menu button */}
              <div className="flex lg:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-expanded="false"
                  aria-label="Open main menu"
                >
                  <HamburgerIcon isOpen={mobileMenuOpen} className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-steel-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Mobile Search */}
                <div className="md:hidden mb-4">
                  <SearchBar placeholder="Search products..." />
                </div>
                
                {/* Mobile Navigation */}
                <CategoryNavigation variant="mobile" />
                
                {/* Mobile Auth */}
                {!state.isAuthenticated && (
                  <div className="pt-4 space-y-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        router.push('/auth/login' as any)
                        setMobileMenuOpen(false)
                      }}
                      className="w-full justify-start"
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => {
                        router.push('/auth/register' as any)
                        setMobileMenuOpen(false)
                      }}
                      className="w-full justify-start"
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Cart Drawer */}
      <CartDrawer 
        isOpen={cartDrawerOpen} 
        onClose={() => setCartDrawerOpen(false)} 
      />
    </>
  )
}

// Icon components
function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-5 w-5", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function HamburgerIcon({ className, isOpen }: { className?: string; isOpen: boolean }) {
  return (
    <svg className={cn("h-6 w-6", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {isOpen ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      )}
    </svg>
  )
} 