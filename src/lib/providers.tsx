'use client'

import { ReactNode } from 'react'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './apollo/client'
import { AuthProvider } from './auth'
import { ToastProvider } from '@/components/ui'
import { ErrorBoundary } from '@/components/error'
import { CartProvider } from '@/context/cart-context'
import { AddressBookProvider } from '@/context/address-context'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <AuthProvider>
          <CartProvider>
            <AddressBookProvider>
              <ToastProvider position="top-right" maxToasts={5}>
                {children}
              </ToastProvider>
            </AddressBookProvider>
          </CartProvider>
        </AuthProvider>
      </ApolloProvider>
    </ErrorBoundary>
  )
} 