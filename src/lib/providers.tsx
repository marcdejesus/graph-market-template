'use client'

import { ReactNode } from 'react'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './apollo/client'
import { AuthProvider } from './auth'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ApolloProvider>
  )
} 