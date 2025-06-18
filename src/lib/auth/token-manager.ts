'use client'

// Token storage keys
const ACCESS_TOKEN_KEY = 'fitmarket_access_token'
const REFRESH_TOKEN_KEY = 'fitmarket_refresh_token'
const TOKEN_EXPIRY_KEY = 'fitmarket_token_expiry'

// Types for token management
interface TokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

interface DecodedToken {
  sub: string
  email: string
  exp: number
  iat: number
}

// Utility to decode JWT token (without verification - for client-side use only)
function decodeJWT(token: string): DecodedToken | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = parts[1]
    if (!payload) return null
    
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return decoded
  } catch (_error) {
    // Silently fail JWT decoding in production
    return null
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token)
  if (!decoded) return true
  
  const currentTime = Math.floor(Date.now() / 1000)
  return decoded.exp < currentTime
}

// Get token expiry timestamp
export function getTokenExpiry(token: string): number | null {
  const decoded = decodeJWT(token)
  return decoded?.exp || null
}

// Secure token storage (client-side with httpOnly considerations)
export function setAuthTokens(tokenResponse: TokenResponse): void {
  try {
    if (typeof window === 'undefined') return

    const expiryTime = Date.now() + (tokenResponse.expiresIn * 1000)
    
    localStorage.setItem(ACCESS_TOKEN_KEY, tokenResponse.accessToken)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokenResponse.refreshToken)
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
    
    // Dispatch custom event for auth state changes
    window.dispatchEvent(new CustomEvent('auth-token-updated', {
      detail: { token: tokenResponse.accessToken }
    }))
  } catch (_error) {
    // Silently fail in production
  }
}

// Get access token with optional refresh
export async function getAuthToken(forceRefresh: boolean = false): Promise<string | null> {
  try {
    if (typeof window === 'undefined') return null

    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY)
    
    if (!accessToken || !expiryTime) return null

    const isExpired = Date.now() > parseInt(expiryTime)
    
    // Return token if valid and not forcing refresh
    if (!isExpired && !forceRefresh) {
      return accessToken
    }

    // Attempt token refresh if expired or forced
    if (isExpired || forceRefresh) {
      const refreshedToken = await refreshAuthToken()
      return refreshedToken
    }

    return accessToken
  } catch (_error) {
    // Silently fail in production
    return null
  }
}

// Refresh authentication token
export async function refreshAuthToken(): Promise<string | null> {
  try {
    if (typeof window === 'undefined') return null

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!refreshToken) {
      removeAuthToken()
      return null
    }

    // Call refresh token endpoint
    const response = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        refreshToken: refreshToken
      })
    })

    if (!response.ok) {
      removeAuthToken()
      return null
    }

    const tokenResponse: TokenResponse = await response.json()
    setAuthTokens(tokenResponse)
    
    return tokenResponse.accessToken
  } catch (_error) {
    // Silently fail token refresh in production
    removeAuthToken()
    return null
  }
}

// Remove all authentication tokens
export function removeAuthToken(): void {
  try {
    if (typeof window === 'undefined') return

    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
    
    // Clear Apollo cache will be handled by auth context
    
    // Dispatch custom event for auth state changes
    window.dispatchEvent(new CustomEvent('auth-token-removed'))
  } catch (_error) {
    // Silently fail in production
  }
}

// Get refresh token
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = await getAuthToken()
    return !!token && !isTokenExpired(token)
  } catch (error) {
    return false
  }
}

// Get user info from token
export function getUserFromToken(): DecodedToken | null {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (!token) return null
    
    return decodeJWT(token)
  } catch (_error) {
    // Silently fail in production
    return null
  }
}

// Auto-refresh token before expiry
export function setupTokenAutoRefresh(): void {
  if (typeof window === 'undefined') return

  setInterval(async () => {
    try {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY)
      const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY)
      
      if (!token || !expiryTime) return

      // Refresh token 5 minutes before expiry
      const timeUntilExpiry = parseInt(expiryTime) - Date.now()
      const fiveMinutes = 5 * 60 * 1000

      if (timeUntilExpiry <= fiveMinutes && timeUntilExpiry > 0) {
        await refreshAuthToken()
      }
    } catch (_error) {
      // Silently fail auto-refresh in production
    }
  }, 60000) // Check every minute
} 