'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { MainLayout } from '@/components/layout'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function OrdersContent() {
  // Mock order data - in real app this would come from API
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 129.99,
      items: 3
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'shipped',
      total: 89.99,
      items: 2
    },
    {
      id: 'ORD-003',
      date: '2024-01-05',
      status: 'processing',
      total: 199.99,
      items: 4
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge variant="success">Delivered</Badge>
      case 'shipped':
        return <Badge variant="info">Shipped</Badge>
      case 'processing':
        return <Badge variant="warning">Processing</Badge>
      default:
        return <Badge variant="default">{status}</Badge>
    }
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-athletic-black">Order History</h1>
            <p className="text-steel-gray mt-2">Track and manage your FitMarket orders</p>
          </div>

          <div className="space-y-6">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-steel-gray text-lg">No orders found</p>
                  <p className="text-steel-gray mt-2">Start shopping to see your orders here!</p>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Order {order.id}</CardTitle>
                        <CardDescription>
                          Placed on {new Date(order.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm text-steel-gray">
                          {order.items} item{order.items > 1 ? 's' : ''}
                        </p>
                        <p className="text-lg font-semibold text-athletic-black">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <button className="text-performance-red hover:text-performance-red/80 transition-colors font-medium">
                        View Details
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  )
} 