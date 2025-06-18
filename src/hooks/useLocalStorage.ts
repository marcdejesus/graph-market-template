'use client'

import { useState } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (_value: T | ((_prevValue: T) => T)) => void] {
  // Initialize state with the value from localStorage or the initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (_error) {
      return initialValue
    }
  })

  // Update localStorage whenever the state changes
  const setValue = (_value: T | ((_prevValue: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = _value instanceof Function ? _value(storedValue) : _value
      setStoredValue(valueToStore)

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (_error) {
      // Silently fail in production
    }
  }

  return [storedValue, setValue]
}

export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (_value: T | ((_prevValue: T) => T)) => void] {
  // Initialize state with the value from sessionStorage or the initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (_error) {
      return initialValue
    }
  })

  // Update sessionStorage whenever the state changes
  const setValue = (_value: T | ((_prevValue: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = _value instanceof Function ? _value(storedValue) : _value
      setStoredValue(valueToStore)

      // Save to sessionStorage
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (_error) {
      // Silently fail in production
    }
  }

  return [storedValue, setValue]
} 