/* eslint-disable no-unused-vars, react-hooks/exhaustive-deps */
'use client'

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

// Toast Types
export type ToastType = 'success' | 'error' | 'warning' | 'info'
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'

export interface Toast {
  id: string
  type: ToastType
  title?: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  onClose?: () => void
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => string
  removeToast: (id: string) => void
  clearAll: () => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

// Toast Provider Component
interface ToastProviderProps {
  children: React.ReactNode
  position?: ToastPosition
  maxToasts?: number
}

export function ToastProvider({ 
  children, 
  position = 'top-right', 
  maxToasts = 5 
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const removeToast = useCallback((toastId: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId))
    
    // Clear timeout if exists
    const timeout = toastTimeouts.current.get(toastId)
    if (timeout) {
      clearTimeout(timeout)
      toastTimeouts.current.delete(toastId)
    }
  }, [])

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const toastId = Math.random().toString(36).substring(2) + Date.now().toString(36)
    const duration = toastData.duration ?? 5000

    const toast: Toast = {
      ...toastData,
      id: toastId
    }

    setToasts(prev => {
      // Remove oldest toast if we're at max capacity
      const newToasts = prev.length >= maxToasts ? prev.slice(1) : prev
      return [...newToasts, toast]
    })

    // Auto-remove toast after duration (unless duration is 0)
    if (duration > 0) {
      const timeout = setTimeout(() => {
        removeToast(toastId)
        toast.onClose?.()
      }, duration)
      
      toastTimeouts.current.set(toastId, timeout)
    }

    return toastId
  }, [maxToasts, removeToast])

  const clearAll = useCallback(() => {
    // Clear all timeouts
    toastTimeouts.current.forEach(timeout => clearTimeout(timeout))
    toastTimeouts.current.clear()
    
    setToasts([])
  }, [])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      const timeouts = toastTimeouts.current
      timeouts.forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAll
  }

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer position={position} toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

// Hook to use toast
export function useToast() {
  const context = useContext(ToastContext)
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return {
    ...context,
    // Convenience methods
    success: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) =>
      context.addToast({ type: 'success', message, ...options }),
    
    error: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) =>
      context.addToast({ type: 'error', message, ...options }),
    
    warning: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) =>
      context.addToast({ type: 'warning', message, ...options }),
    
    info: (message: string, options?: Partial<Omit<Toast, 'id' | 'type' | 'message'>>) =>
      context.addToast({ type: 'info', message, ...options })
  }
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Toast[]
  position: ToastPosition
  onRemove: (id: string) => void
}

function ToastContainer({ toasts, position, onRemove }: ToastContainerProps) {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
  }

  if (toasts.length === 0) return null

  return (
    <div className={cn('fixed z-50 space-y-2 w-full max-w-sm', positionClasses[position])}>
      {toasts.map((toast, index) => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
          index={index}
        />
      ))}
    </div>
  )
}

// Individual Toast Component
interface ToastComponentProps {
  toast: Toast
  onRemove: (id: string) => void
  index: number
}

function ToastComponent({ toast, onRemove, index }: ToastComponentProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10)
    return () => clearTimeout(timer)
  }, [])

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      onRemove(toast.id)
      toast.onClose?.()
    }, 200) // Match animation duration
  }

  const typeConfig = {
    success: {
      bgColor: 'bg-success-50 border-success-200',
      iconColor: 'text-success-600',
      textColor: 'text-success-800',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    error: {
      bgColor: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-800',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    warning: {
      bgColor: 'bg-energy-50 border-energy-200',
      iconColor: 'text-energy-600',
      textColor: 'text-energy-800',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      )
    },
    info: {
      bgColor: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-800',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }

  const config = typeConfig[toast.type]

  return (
    <div
      className={cn(
        'relative transform transition-all duration-200 ease-in-out',
        isVisible && !isRemoving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95',
        isRemoving && '-translate-x-full opacity-0'
      )}
      style={{ 
        transitionDelay: `${index * 50}ms` // Stagger animations
      }}
    >
      <div className={cn(
        'relative flex items-start space-x-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm',
        config.bgColor
      )}>
        {/* Icon */}
        <div className={cn('flex-shrink-0', config.iconColor)}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h4 className={cn('text-sm font-medium', config.textColor)}>
              {toast.title}
            </h4>
          )}
          <p className={cn('text-sm', toast.title ? 'mt-1' : '', config.textColor)}>
            {toast.message}
          </p>

          {/* Action Button */}
          {toast.action && (
            <div className="mt-3">
              <button
                onClick={() => {
                  toast.action!.onClick()
                  handleRemove()
                }}
                className={cn(
                  'text-sm font-medium underline hover:no-underline transition-all',
                  config.textColor
                )}
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={handleRemove}
          className={cn(
            'flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors',
            config.iconColor
          )}
          aria-label="Close notification"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
} 