'use client'

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { CartState, CartItem } from '@/types'

// Cart Action Types
type CartAction = 
  | { type: 'LOAD_CART'; payload: CartState }
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> & { quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; size?: string; color?: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number; size?: string; color?: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SYNC_WITH_SERVER'; payload: CartState }
  | { type: 'OPTIMISTIC_UPDATE'; payload: CartState }
  | { type: 'REVERT_OPTIMISTIC'; payload: CartState }

// Extended Cart State with UI states
interface ExtendedCartState extends CartState {
  isLoading: boolean
  error: string | null
  isOnline: boolean
  pendingSyncActions: CartAction[]
  lastSyncedAt: Date | null
}

// Cart Context Interface
interface CartContextType {
  state: ExtendedCartState
  addToCart: (_item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>
  removeFromCart: (_productId: string, _size?: string, _color?: string) => Promise<void>
  updateQuantity: (_productId: string, _quantity: number, _size?: string, _color?: string) => Promise<void>
  clearCart: () => Promise<void>
  getCartItem: (_productId: string, _size?: string, _color?: string) => CartItem | undefined
  syncWithServer: () => Promise<void>
  retryFailedActions: () => Promise<void>
}

const CART_STORAGE_KEY = 'fitmarket-cart'
const CART_ACTIONS_STORAGE_KEY = 'fitmarket-cart-actions'

const initialCartState: ExtendedCartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  lastUpdated: new Date(),
  isLoading: false,
  error: null,
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
  pendingSyncActions: [],
  lastSyncedAt: null
}

// Cart Reducer
function cartReducer(state: ExtendedCartState, action: CartAction): ExtendedCartState {
  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        ...action.payload,
        isLoading: false
      }

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }

    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        cartItem => 
          cartItem.productId === action.payload.productId &&
          cartItem.size === action.payload.size &&
          cartItem.color === action.payload.color
      )

      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = state.items.map((cartItem, index) => 
          index === existingItemIndex
            ? { 
                ...cartItem, 
                quantity: Math.min(
                  cartItem.quantity + (action.payload.quantity || 1),
                  cartItem.maxQuantity
                )
              }
            : cartItem
        )
      } else {
        // Add new item
        newItems = [
          ...state.items,
          {
            ...action.payload,
            quantity: action.payload.quantity || 1
          }
        ]
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
        lastUpdated: new Date(),
        error: null
      }
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(
        item => !(
          item.productId === action.payload.productId &&
          item.size === action.payload.size &&
          item.color === action.payload.color
        )
      )

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
        lastUpdated: new Date(),
        error: null
      }
    }

    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, {
          type: 'REMOVE_ITEM',
          payload: {
            productId: action.payload.productId,
            size: action.payload.size,
            color: action.payload.color
          }
        })
      }

      const newItems = state.items.map(item => 
        item.productId === action.payload.productId &&
        item.size === action.payload.size &&
        item.color === action.payload.color
          ? { ...item, quantity: Math.min(action.payload.quantity, item.maxQuantity) }
          : item
      )

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        ...state,
        items: newItems,
        totalItems,
        totalAmount,
        lastUpdated: new Date(),
        error: null
      }
    }

    case 'CLEAR_CART':
      return {
        ...initialCartState,
        isOnline: state.isOnline,
        lastSyncedAt: new Date()
      }

    case 'SYNC_WITH_SERVER':
      return {
        ...state,
        ...action.payload,
        lastSyncedAt: new Date(),
        pendingSyncActions: [],
        error: null
      }

    case 'OPTIMISTIC_UPDATE':
      return {
        ...action.payload,
        isLoading: state.isLoading,
        error: state.error,
        isOnline: state.isOnline,
        pendingSyncActions: state.pendingSyncActions,
        lastSyncedAt: state.lastSyncedAt
      }

    case 'REVERT_OPTIMISTIC':
      return {
        ...action.payload,
        isLoading: state.isLoading,
        error: state.error,
        isOnline: state.isOnline,
        pendingSyncActions: state.pendingSyncActions,
        lastSyncedAt: state.lastSyncedAt
      }

    default:
      return state
  }
}

// Create Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Mock toast functions for SSG compatibility
const mockToast = {
  success: () => {},
  error: () => {}
}

// Cart Provider Component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCartFromStorage = () => {
      try {
        if (typeof window === 'undefined') return // Skip during SSR
        
        const savedCart = localStorage.getItem(CART_STORAGE_KEY)
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          dispatch({
            type: 'LOAD_CART',
            payload: {
              ...parsedCart,
              lastUpdated: new Date(parsedCart.lastUpdated),
              lastSyncedAt: parsedCart.lastSyncedAt ? new Date(parsedCart.lastSyncedAt) : null
            }
          })
        }
      } catch (_error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load cart from localStorage:', _error)
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load saved cart' })
      }
    }

    loadCartFromStorage()
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === 'undefined') return // Skip during SSR
    
    if (state.items.length > 0 || state.lastSyncedAt) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
          items: state.items,
          totalItems: state.totalItems,
          totalAmount: state.totalAmount,
          lastUpdated: state.lastUpdated,
          lastSyncedAt: state.lastSyncedAt
        }))
      } catch (_error) {
        // eslint-disable-next-line no-console
        console.error('Failed to save cart to localStorage:', _error)
      }
    }
  }, [state.items, state.totalItems, state.totalAmount, state.lastUpdated, state.lastSyncedAt])

  // Simulate server API calls (replace with actual API calls)
  const syncWithServer = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined' || !navigator.onLine) {
      return
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true })

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // In a real implementation, you would:
      // 1. Send pending actions to the server
      // 2. Get the updated cart state from the server
      // 3. Handle conflicts and merge changes

      // For now, we'll just mark as synced
      dispatch({
        type: 'SYNC_WITH_SERVER',
        payload: {
          items: state.items,
          totalItems: state.totalItems,
          totalAmount: state.totalAmount,
          lastUpdated: state.lastUpdated
        }
      })

      if (state.pendingSyncActions.length > 0) {
        mockToast.success()
      }
    } catch (_error) {
      // eslint-disable-next-line no-console
      console.error('Failed to sync cart with server:', _error)
      dispatch({ type: 'SET_ERROR', payload: 'Failed to sync cart with server' })
      mockToast.error()
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [state.items, state.totalItems, state.totalAmount, state.lastUpdated, state.pendingSyncActions.length])

  // Handle online/offline status
  useEffect(() => {
    if (typeof window === 'undefined') return // Skip during SSR

    const handleOnline = () => {
      dispatch({ type: 'SET_ERROR', payload: null })
      // Auto-sync when coming back online
      if (state.pendingSyncActions.length > 0) {
        syncWithServer()
      }
    }

    const handleOffline = () => {
      dispatch({ type: 'SET_ERROR', payload: 'You are offline. Changes will be synced when connection is restored.' })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [state.pendingSyncActions.length, syncWithServer])

  // Optimistic update helper
  const performOptimisticUpdate = useCallback(async (
    action: CartAction,
    _successMessage?: string
  ): Promise<void> => {
    // Store current state for potential rollback
    const previousState = { ...state }
    
    try {
      // Apply optimistic update
      dispatch(action)

      // Attempt to sync with server if online
      if (typeof window !== 'undefined' && navigator.onLine) {
        await syncWithServer()
      } else if (typeof window !== 'undefined') {
        // Store action for later sync when online
        const savedActions = localStorage.getItem(CART_ACTIONS_STORAGE_KEY)
        const _pendingActions = savedActions ? JSON.parse(savedActions) : []
        _pendingActions.push(action)
        localStorage.setItem(CART_ACTIONS_STORAGE_KEY, JSON.stringify(_pendingActions))
      }
    } catch (_error) {
      // Revert optimistic update on failure
      dispatch({ type: 'REVERT_OPTIMISTIC', payload: previousState })
      // eslint-disable-next-line no-console
      console.error('Cart operation failed:', _error)
      mockToast.error()
    }
  }, [state, syncWithServer])

  // Cart Actions
  const addToCart = useCallback(async (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    await performOptimisticUpdate(
      { type: 'ADD_ITEM', payload: item },
      `Added ${item.name} to cart`
    )
  }, [performOptimisticUpdate])

  const removeFromCart = useCallback(async (productId: string, size?: string, color?: string) => {
    const item = state.items.find(item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color
    )
    
    await performOptimisticUpdate(
      { type: 'REMOVE_ITEM', payload: { productId, size, color } },
      item ? `Removed ${item.name} from cart` : 'Item removed from cart'
    )
  }, [state.items, performOptimisticUpdate])

  const updateQuantity = useCallback(async (
    productId: string, 
    quantity: number, 
    size?: string, 
    color?: string
  ) => {
    await performOptimisticUpdate(
      { type: 'UPDATE_QUANTITY', payload: { productId, quantity, size, color } }
    )
  }, [performOptimisticUpdate])

  const clearCart = useCallback(async () => {
    await performOptimisticUpdate(
      { type: 'CLEAR_CART' },
      'Cart cleared'
    )
  }, [performOptimisticUpdate])

  const getCartItem = useCallback((productId: string, size?: string, color?: string) => {
    return state.items.find(
      item => 
        item.productId === productId &&
        item.size === size &&
        item.color === color
    )
  }, [state.items])

  const retryFailedActions = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.onLine) {
      mockToast.error()
      return
    }

    try {
      const savedActions = localStorage.getItem(CART_ACTIONS_STORAGE_KEY)
      if (savedActions) {
        const _pendingActions = JSON.parse(savedActions)
        // In a real implementation, replay these actions on the server
        localStorage.removeItem(CART_ACTIONS_STORAGE_KEY)
        await syncWithServer()
        mockToast.success()
      }
    } catch (_error) {
      // eslint-disable-next-line no-console
      console.error('Failed to retry actions:', _error)
      mockToast.error()
    }
  }, [syncWithServer])

  const value: CartContextType = {
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem,
    syncWithServer,
    retryFailedActions
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use cart context
export function useCartContext(): CartContextType {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider')
  }
  return context
} 