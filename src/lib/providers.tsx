'use client'

import { ReactNode } from 'react'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './apollo/client'
import { AuthProvider } from './auth'
import { ToastProvider } from '@/components/ui'
import { ErrorBoundary } from '@/components/error'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <ToastProvider position="top-right" maxToasts={5}>
            {children}
          </ToastProvider>
        </AuthProvider>
      </ApolloProvider>
    </ErrorBoundary>
  )
} 