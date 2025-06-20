'use client'

import { useCheckout } from '@/context/checkout-context'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  Mail, 
  Calendar,
  Download,
  Home,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export function OrderSuccessStep() {
  const { state } = useCheckout()
  const router = useRouter()

  // Mock order result - in a real app this would come from the order placement
  const orderResult = {
    id: 'ord_1234567890',
    orderNumber: '#FM-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
    status: 'confirmed' as const,
    totalAmount: state.orderSummary.total,
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    createdAt: new Date()
  }

  const handleContinueShopping = () => {
    router.push('/products')
  }

  const handleViewOrder = () => {
    // For now, navigate to a general orders page since individual order pages aren't implemented yet
    router.push('/orders')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const downloadInvoice = () => {
    // Mock download action
    console.log('Downloading invoice for order:', orderResult.orderNumber)
  }

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      {/* Success Icon and Message */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">Order Confirmed!</h2>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been successfully placed and is being processed.
          </p>
        </div>
      </div>

      {/* Order Details Card */}
      <div className="bg-gray-50 rounded-lg p-6 text-left space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
          <Badge className="bg-green-100 text-green-800">
            {orderResult.status.charAt(0).toUpperCase() + orderResult.status.slice(1)}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-medium text-gray-900">{orderResult.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Date:</span>
              <span className="font-medium text-gray-900">
                {orderResult.createdAt.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium text-gray-900">
                ${orderResult.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Estimated Delivery:</span>
              <span className="font-medium text-gray-900">
                {orderResult.estimatedDelivery.toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping Method:</span>
              <span className="font-medium text-gray-900">
                {state.shippingInfo?.method.name || 'Standard Shipping'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Order Status:</span>
              <span className="font-medium text-gray-900">Confirmed</span>
            </div>
          </div>
        </div>
      </div>

      {/* What's Next Section */}
      <div className="bg-blue-50 rounded-lg p-6 text-left">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What happens next?</h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Mail className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Confirmation Email</p>
              <p className="text-sm text-gray-600">
                We've sent a confirmation email to {state.shippingInfo?.address.firstName?.toLowerCase() || 'your email'} with your order details and receipt.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Package className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Processing</p>
              <p className="text-sm text-gray-600">
                Your order is being prepared for shipment. This usually takes 1-2 business days.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Truck className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Shipping</p>
              <p className="text-sm text-gray-600">
                Once shipped, you'll receive tracking information to monitor your order's progress.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Calendar className="w-3 h-3 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Delivery</p>
              <p className="text-sm text-gray-600">
                Expected delivery: {orderResult.estimatedDelivery.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address Summary */}
      {state.shippingInfo && (
        <div className="bg-gray-50 rounded-lg p-6 text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Shipping Address</h3>
          <div className="text-sm space-y-1">
            <p className="font-medium text-gray-900">
              {state.shippingInfo.address.firstName} {state.shippingInfo.address.lastName}
            </p>
            <p className="text-gray-600">{state.shippingInfo.address.address1}</p>
            {state.shippingInfo.address.address2 && (
              <p className="text-gray-600">{state.shippingInfo.address.address2}</p>
            )}
            <p className="text-gray-600">
              {state.shippingInfo.address.city}, {state.shippingInfo.address.province} {state.shippingInfo.address.zip}
            </p>
            <p className="text-gray-600">{state.shippingInfo.address.country}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleViewOrder}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            View Order Details
          </Button>
          
          <Button
            onClick={downloadInvoice}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Invoice
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            onClick={handleContinueShopping}
            className="w-full bg-[#e53e3e] hover:bg-[#c53030] text-white flex items-center justify-center gap-2"
          >
            Continue Shopping
            <ArrowRight className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handleGoHome}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Button>
        </div>
      </div>

      {/* Customer Support */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          Need help with your order?
        </p>
        <div className="flex justify-center gap-4 text-sm">
          <button className="text-[#e53e3e] hover:underline">
            Contact Support
          </button>
          <span className="text-gray-300">|</span>
          <button className="text-[#e53e3e] hover:underline">
            Track Your Order
          </button>
          <span className="text-gray-300">|</span>
          <button className="text-[#e53e3e] hover:underline">
            Return Policy
          </button>
        </div>
      </div>
    </div>
  )
} 