import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { getAuthToken, removeAuthToken, isTokenExpired } from '../auth/token-manager'
import { createProductCacheConfig } from '../cache/productCache'

// HTTP Link to GraphQL endpoint
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
  credentials: 'include', // Include cookies for httpOnly tokens
})

// Authentication Link - adds auth headers to requests
const authLink = setContext(async (_, { headers }) => {
  try {
    const token = await getAuthToken()
    
    // Check if token is expired and needs refresh
    if (token && isTokenExpired(token)) {
      // Token refresh will be handled by the token manager
      const refreshedToken = await getAuthToken(true) // Force refresh
      return {
        headers: {
          ...headers,
          authorization: refreshedToken ? `Bearer ${refreshedToken}` : '',
        }
      }
    }

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : '',
      }
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Error setting auth header:', error)
    }
    return {
      headers: {
        ...headers,
        authorization: '',
      }
    }
  }
})

// Error Link - handles authentication errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.error(
          `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      }

      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED' || message.includes('Unauthorized')) {
        // Clear invalid token
        removeAuthToken()
        
        // Redirect to login if on a protected route
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname
          const protectedRoutes = ['/profile', '/orders', '/checkout']
          const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route))
          
          if (isProtectedRoute) {
            window.location.href = `/auth/login?redirect=${encodeURIComponent(currentPath)}`
          }
        }
      }
    })
  }

  if (networkError) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(`Network error: ${networkError}`)
    }
    
    // Handle network authentication errors
    if ('statusCode' in networkError && networkError.statusCode === 401) {
      removeAuthToken()
    }
  }
})

// Apollo Client Cache Configuration
const cache = new InMemoryCache({
  // Merge product cache configuration with existing policies
  ...createProductCacheConfig(),
  typePolicies: {
    ...createProductCacheConfig().typePolicies,
    User: {
      fields: {
        orders: {
          merge(_existing = [], incoming) {
            return incoming
          }
        }
      }
    }
  }
})

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache,
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: process.env.NODE_ENV === 'development',
})

// Helper function to reset cache (useful for logout)
export const resetApolloCache = () => {
  return apolloClient.clearStore()
} 