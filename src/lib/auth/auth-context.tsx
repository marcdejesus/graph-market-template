'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { 
  getAuthToken, 
  removeAuthToken, 
  isAuthenticated, 
  getUserFromToken,
  setupTokenAutoRefresh
} from './token-manager'
import { User, AuthState } from '@/types'

// Authentication Actions
type AuthAction = 
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'TOKEN_REFRESH_SUCCESS'; payload: { token: string } }
  | { type: 'TOKEN_REFRESH_FAILURE' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CLEAR_ERROR' }

// Initial authentication state
const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
}

// Authentication reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null
      }
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      }
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      }
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      }
    
    case 'TOKEN_REFRESH_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        error: null
      }
    
    case 'TOKEN_REFRESH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: 'Session expired. Please log in again.'
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    
    default:
      return state
  }
}

// Authentication context
interface AuthContextType {
  state: AuthState
  login: (_email: string, _password: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Authentication provider component
interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState)

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
    setupTokenAutoRefresh()
    
    // Listen for token updates
    const handleTokenUpdate = (event: CustomEvent) => {
      const { token } = event.detail
      const userFromToken = getUserFromToken()
      
      if (userFromToken) {
        dispatch({
          type: 'TOKEN_REFRESH_SUCCESS',
          payload: { token }
        })
      }
    }

    // Listen for token removal
    const handleTokenRemoval = () => {
      dispatch({ type: 'LOGOUT' })
    }

    window.addEventListener('auth-token-updated', handleTokenUpdate as EventListener)
    window.addEventListener('auth-token-removed', handleTokenRemoval)

    return () => {
      window.removeEventListener('auth-token-updated', handleTokenUpdate as EventListener)
      window.removeEventListener('auth-token-removed', handleTokenRemoval)
    }
  }, [])

  // Check authentication status
  const checkAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      
      const isUserAuthenticated = await isAuthenticated()
      
      if (isUserAuthenticated) {
        const token = await getAuthToken()
        const userFromToken = getUserFromToken()
        
        if (token && userFromToken) {
          // Convert token data to User type
          const user: User = {
            id: userFromToken.sub,
            email: userFromToken.email,
            firstName: '', // These would come from a full user query
            lastName: '',
            avatar: undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { user, token }
          })
        } else {
          dispatch({ type: 'LOGOUT' })
        }
      } else {
        dispatch({ type: 'LOGOUT' })
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error('Error checking auth:', error)
      }
      dispatch({ type: 'LOGOUT' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Login function - now handled by useLogin hook in components
  // This is kept for context compatibility but shouldn't be used directly
  const login = async (_email: string, _password: string): Promise<boolean> => {
    // Login functionality is now handled by the useLogin hook
    // Components should use the hook directly for better error handling
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn('login() from AuthContext is deprecated. Use useLogin hook instead.')
    }
    return false
  }

  // Logout function
  const logout = () => {
    removeAuthToken()
    dispatch({ type: 'LOGOUT' })
  }

  // Clear error function
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value: AuthContextType = {
    state,
    login,
    logout,
    clearError,
    checkAuth
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use authentication context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook to get authentication state only
export function useAuthState(): AuthState {
  const { state } = useAuth()
  return state
}

// Hook for protected routes
export function useRequireAuth() {
  const { state } = useAuth()
  
  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      // Redirect to login or show login modal
      const currentPath = window.location.pathname
      window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`
    }
  }, [state.isAuthenticated, state.isLoading])

  return state
} 