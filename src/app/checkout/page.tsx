import { CheckoutProvider } from '@/context/checkout-context'
import { CheckoutFlow } from '@/components/checkout/checkout-flow'

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <CheckoutFlow />
    </CheckoutProvider>
  )
}

// Metadata for the checkout page
export const metadata = {
  title: 'Checkout - FitMarket',
  description: 'Complete your order securely and safely',
  robots: 'noindex, nofollow' // Don't index checkout pages
} 