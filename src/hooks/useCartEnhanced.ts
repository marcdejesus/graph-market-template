'use client'

import { useCartContext } from '@/context/cart-context'
import { CartItem } from '@/types'

// Enhanced cart hook with additional functionality
export function useCartEnhanced() {
  const context = useCartContext()

  // Computed properties for better UX
  const cartSummary = {
    itemCount: context.state.totalItems,
    subtotal: context.state.totalAmount,
    tax: context.state.totalAmount * 0.0875, // 8.75% tax rate
    shipping: context.state.totalAmount >= 75 ? 0 : 8.99, // Free shipping over $75
    total: context.state.totalAmount + (context.state.totalAmount * 0.0875) + (context.state.totalAmount >= 75 ? 0 : 8.99)
  }

  // Helper functions
  const isItemInCart = (productId: string, size?: string, color?: string): boolean => {
    return !!context.getCartItem(productId, size, color)
  }

  const getItemQuantity = (productId: string, size?: string, color?: string): number => {
    const item = context.getCartItem(productId, size, color)
    return item ? item.quantity : 0
  }

  const canAddMoreItems = (productId: string, size?: string, color?: string): boolean => {
    const item = context.getCartItem(productId, size, color)
    return item ? item.quantity < item.maxQuantity : true
  }

  const getTotalUniqueItems = (): number => {
    return context.state.items.length
  }

  const getCartWeight = (): number => {
    // Estimate weight for shipping calculations (in lbs)
    return context.state.items.reduce((weight: number, item: CartItem) => {
      // Estimate 0.5 lbs per item (would come from product data in real app)
      return weight + (item.quantity * 0.5)
    }, 0)
  }

  const getEstimatedDelivery = (): Date => {
    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + (cartSummary.shipping === 0 ? 3 : 5))
    return deliveryDate
  }

  const validateCartBeforeCheckout = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []

    if (context.state.items.length === 0) {
      errors.push('Your cart is empty')
    }

    // Check for out of stock items (in a real app, this would check current inventory)
    context.state.items.forEach((item: CartItem) => {
      if (item.quantity > item.maxQuantity) {
        errors.push(`${item.name} quantity exceeds available stock`)
      }
    })

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  const getRecommendedProducts = (): string[] => {
    // In a real app, this would return product IDs based on cart contents
    const categorySet = new Set(context.state.items.map((item: CartItem) => item.productId.split('-')[0] || 'unknown'))
    const categories = Array.from(categorySet) as string[]
    // Return mock recommendations
    return categories.slice(0, 4)
  }

  const addMultipleItems = async (items: (Omit<CartItem, 'quantity'> & { quantity?: number })[]): Promise<void> => {
    try {
      for (const item of items) {
        await context.addToCart(item)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to add multiple items:', error)
      throw error
    }
  }

  const updateMultipleQuantities = async (
    updates: { productId: string; quantity: number; size?: string; color?: string }[]
  ): Promise<void> => {
    try {
      for (const update of updates) {
        await context.updateQuantity(update.productId, update.quantity, update.size, update.color)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update multiple quantities:', error)
      throw error
    }
  }

  const moveToWishlist = async (productId: string, size?: string, color?: string): Promise<void> => {
    // In a real app, this would add to wishlist and remove from cart
    // For now, just remove from cart
    await context.removeFromCart(productId, size, color)
  }

  const saveForLater = async (productId: string, size?: string, color?: string): Promise<void> => {
    // In a real app, this would move item to a "saved for later" list
    // For now, just remove from cart
    await context.removeFromCart(productId, size, color)
  }

  const applyPromoCode = async (code: string): Promise<{ success: boolean; discount: number; message: string }> => {
    // Mock promo code validation
    const validCodes: Record<string, { discount: number; message: string }> = {
      'WELCOME10': { discount: 0.1, message: '10% off your first order!' },
      'SAVE20': { discount: 0.2, message: '20% off your purchase!' },
      'FREESHIP': { discount: 0, message: 'Free shipping on this order!' }
    }

    const promoCode = validCodes[code.toUpperCase()]
    if (promoCode) {
      return {
        success: true,
        discount: promoCode.discount,
        message: promoCode.message
      }
    }

    return {
      success: false,
      discount: 0,
      message: 'Invalid promo code'
    }
  }

  const getCartAnalytics = () => {
    const categories = context.state.items.reduce((acc: Record<string, number>, item: CartItem) => {
      const category = item.productId.split('-')[0] || 'unknown' // Mock category extraction
      acc[category] = (acc[category] || 0) + item.quantity
      return acc
    }, {})

    const averageItemPrice = context.state.items.length > 0 
      ? context.state.totalAmount / context.state.totalItems 
      : 0

    return {
      categories,
      averageItemPrice,
      cartValue: context.state.totalAmount,
      itemCount: context.state.totalItems,
      uniqueItems: context.state.items.length,
      lastUpdated: context.state.lastUpdated,
      isCartAbandoned: Date.now() - context.state.lastUpdated.getTime() > 24 * 60 * 60 * 1000 // 24 hours
    }
  }

  return {
    // Core cart functionality from context
    ...context,
    
    // Backward compatibility with existing useCart hook
    cart: {
      items: context.state.items,
      totalItems: context.state.totalItems,
      totalAmount: context.state.totalAmount,
      lastUpdated: context.state.lastUpdated
    },

    // Enhanced functionality
    cartSummary,
    isItemInCart,
    getItemQuantity,
    canAddMoreItems,
    getTotalUniqueItems,
    getCartWeight,
    getEstimatedDelivery,
    validateCartBeforeCheckout,
    getRecommendedProducts,
    addMultipleItems,
    updateMultipleQuantities,
    moveToWishlist,
    saveForLater,
    applyPromoCode,
    getCartAnalytics,

    // UI state
    isLoading: context.state.isLoading,
    error: context.state.error,
    isOnline: context.state.isOnline,
    hasPendingSync: context.state.pendingSyncActions.length > 0,
    lastSyncedAt: context.state.lastSyncedAt
  }
} 