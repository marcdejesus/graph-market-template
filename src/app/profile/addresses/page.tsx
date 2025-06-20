import { Metadata } from 'next'
import { AddressBook } from '@/components/address'

export const metadata: Metadata = {
  title: 'Manage Addresses - FitMarket',
  description: 'Manage your saved addresses for faster checkout',
}

export default function AddressesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <AddressBook />
        </div>
      </div>
    </div>
  )
} 