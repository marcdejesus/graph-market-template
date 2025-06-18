'use client'

import { useState, useEffect } from 'react'
import { CartState, CartItem } from '@/types'

const CART_STORAGE_KEY = 'fitmarket-cart'

const initialCartState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  lastUpdated: new Date()
}

export function useCart() {
  const [cart, setCart] = useState<CartState>(initialCartState)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY)
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        setCart({
          ...parsedCart,
          lastUpdated: new Date(parsedCart.lastUpdated)
        })
      } catch (_error) {
        // Silently fail in production
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.error('Failed to load cart from localStorage:', _error)
        }
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.items.findIndex(
        cartItem => 
          cartItem.productId === item.productId &&
          cartItem.size === item.size &&
          cartItem.color === item.color
      )

      let newItems: CartItem[]

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        newItems = prevCart.items.map((cartItem, index) => 
          index === existingItemIndex
            ? { 
                ...cartItem, 
                quantity: Math.min(
                  cartItem.quantity + (item.quantity || 1),
                  cartItem.maxQuantity
                )
              }
            : cartItem
        )
      } else {
        // Add new item
        newItems = [
          ...prevCart.items,
          {
            ...item,
            quantity: item.quantity || 1
          }
        ]
      }

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        items: newItems,
        totalItems,
        totalAmount,
        lastUpdated: new Date()
      }
    })
  }

  const removeFromCart = (productId: string, size?: string, color?: string) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(
        item => !(
          item.productId === productId &&
          item.size === size &&
          item.color === color
        )
      )

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        items: newItems,
        totalItems,
        totalAmount,
        lastUpdated: new Date()
      }
    })
  }

  const updateQuantity = (
    productId: string, 
    newQuantity: number, 
    size?: string, 
    color?: string
  ) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, size, color)
      return
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item => 
        item.productId === productId &&
        item.size === size &&
        item.color === color
          ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) }
          : item
      )

      const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0)
      const totalAmount = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

      return {
        items: newItems,
        totalItems,
        totalAmount,
        lastUpdated: new Date()
      }
    })
  }

  const clearCart = () => {
    setCart(initialCartState)
  }

  const getCartItem = (productId: string, size?: string, color?: string) => {
    return cart.items.find(
      item => 
        item.productId === productId &&
        item.size === size &&
        item.color === color
    )
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem
  }
} 