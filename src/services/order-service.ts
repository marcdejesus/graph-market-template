import { apolloClient } from '@/lib/apollo/client'
import { 
  CREATE_ORDER,
  UPDATE_ORDER_STATUS,
  CANCEL_ORDER,
  PROCESS_PAYMENT,
  APPLY_PROMO_CODE,
  REORDER
} from '@/lib/apollo/mutations/order'
import {
  GET_USER_ORDERS,
  GET_ORDER,
  GET_ORDER_BY_NUMBER,
  GET_ORDER_TRACKING,
  GET_ORDER_SUMMARIES,
  CHECK_ORDER_STATUS
} from '@/lib/apollo/queries/orders'
import type {
  Order,
  CreateOrderInput,
  CreateOrderResult,
  UpdateOrderResult,
  OrderFilters,
  OrderListResponse,
  OrderTracking,
  OrderSummaryDisplay,
  OrderStatus
} from '@/types/order'

export class OrderService {
  // Create a new order
  static async createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CREATE_ORDER,
        variables: { input },
        errorPolicy: 'all'
      })

      if (data?.createOrder?.success) {
        return {
          order: data.createOrder.order,
          success: true,
          message: data.createOrder.message
        }
      } else {
        return {
          order: null as any,
          success: false,
          message: data?.createOrder?.message || 'Failed to create order'
        }
      }
    } catch (error) {
      console.error('Error creating order:', error)
      return {
        order: null as any,
        success: false,
        message: 'An error occurred while creating the order'
      }
    }
  }

  // Get user orders with pagination and filtering
  static async getUserOrders(
    limit = 10,
    offset = 0,
    filters?: OrderFilters
  ): Promise<OrderListResponse> {
    try {
      const { data } = await apolloClient.query({
        query: GET_USER_ORDERS,
        variables: { limit, offset, filters },
        errorPolicy: 'all',
        fetchPolicy: 'cache-and-network'
      })

      return {
        orders: data?.userOrders?.orders || [],
        totalCount: data?.userOrders?.totalCount || 0,
        hasNextPage: data?.userOrders?.hasNextPage || false,
        hasPreviousPage: data?.userOrders?.hasPreviousPage || false
      }
    } catch (error) {
      console.error('Error fetching user orders:', error)
      return {
        orders: [],
        totalCount: 0,
        hasNextPage: false,
        hasPreviousPage: false
      }
    }
  }

  // Get a single order by ID
  static async getOrder(orderId: string): Promise<Order | null> {
    try {
      const { data } = await apolloClient.query({
        query: GET_ORDER,
        variables: { orderId },
        errorPolicy: 'all',
        fetchPolicy: 'cache-first'
      })

      return data?.order || null
    } catch (error) {
      console.error('Error fetching order:', error)
      return null
    }
  }

  // Get order by order number
  static async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    try {
      const { data } = await apolloClient.query({
        query: GET_ORDER_BY_NUMBER,
        variables: { orderNumber },
        errorPolicy: 'all',
        fetchPolicy: 'cache-first'
      })

      return data?.orderByNumber || null
    } catch (error) {
      console.error('Error fetching order by number:', error)
      return null
    }
  }

  // Update order status
  static async updateOrderStatus(
    orderId: string, 
    status: OrderStatus
  ): Promise<UpdateOrderResult> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_ORDER_STATUS,
        variables: { orderId, status },
        errorPolicy: 'all'
      })

      if (data?.updateOrderStatus?.success) {
        return {
          order: data.updateOrderStatus.order,
          success: true,
          message: data.updateOrderStatus.message
        }
      } else {
        return {
          order: null as any,
          success: false,
          message: data?.updateOrderStatus?.message || 'Failed to update order status'
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      return {
        order: null as any,
        success: false,
        message: 'An error occurred while updating the order status'
      }
    }
  }

  // Cancel an order
  static async cancelOrder(orderId: string, reason?: string): Promise<UpdateOrderResult> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: CANCEL_ORDER,
        variables: { orderId, reason },
        errorPolicy: 'all'
      })

      if (data?.cancelOrder?.success) {
        return {
          order: data.cancelOrder.order,
          success: true,
          message: data.cancelOrder.message
        }
      } else {
        return {
          order: null as any,
          success: false,
          message: data?.cancelOrder?.message || 'Failed to cancel order'
        }
      }
    } catch (error) {
      console.error('Error canceling order:', error)
      return {
        order: null as any,
        success: false,
        message: 'An error occurred while canceling the order'
      }
    }
  }

  // Get order tracking information
  static async getOrderTracking(orderId: string): Promise<OrderTracking | null> {
    try {
      const { data } = await apolloClient.query({
        query: GET_ORDER_TRACKING,
        variables: { orderId },
        errorPolicy: 'all',
        fetchPolicy: 'cache-first'
      })

      return data?.orderTracking || null
    } catch (error) {
      console.error('Error fetching order tracking:', error)
      return null
    }
  }

  // Process payment for an order
  static async processPayment(
    orderId: string, 
    paymentMethodId: string
  ): Promise<{ success: boolean; message?: string; paymentStatus?: string; transactionId?: string }> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: PROCESS_PAYMENT,
        variables: { orderId, paymentMethodId },
        errorPolicy: 'all'
      })

      return {
        success: data?.processPayment?.success || false,
        message: data?.processPayment?.message,
        paymentStatus: data?.processPayment?.paymentStatus,
        transactionId: data?.processPayment?.transactionId
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      return {
        success: false,
        message: 'An error occurred while processing the payment'
      }
    }
  }

  // Apply promo code to order
  static async applyPromoCode(
    orderId: string, 
    promoCode: string
  ): Promise<{ success: boolean; message?: string; discount?: number; newTotal?: number }> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: APPLY_PROMO_CODE,
        variables: { orderId, promoCode },
        errorPolicy: 'all'
      })

      return {
        success: data?.applyPromoCode?.success || false,
        message: data?.applyPromoCode?.message,
        discount: data?.applyPromoCode?.discount,
        newTotal: data?.applyPromoCode?.newTotal
      }
    } catch (error) {
      console.error('Error applying promo code:', error)
      return {
        success: false,
        message: 'An error occurred while applying the promo code'
      }
    }
  }

  // Reorder items from a previous order
  static async reorder(orderId: string): Promise<CreateOrderResult> {
    try {
      const { data } = await apolloClient.mutate({
        mutation: REORDER,
        variables: { orderId },
        errorPolicy: 'all'
      })

      if (data?.reorder?.success) {
        return {
          order: data.reorder.order,
          success: true,
          message: data.reorder.message
        }
      } else {
        return {
          order: null as any,
          success: false,
          message: data?.reorder?.message || 'Failed to reorder'
        }
      }
    } catch (error) {
      console.error('Error reordering:', error)
      return {
        order: null as any,
        success: false,
        message: 'An error occurred while reordering'
      }
    }
  }

  // Get order summaries (for order history lists)
  static async getOrderSummaries(
    limit = 10, 
    offset = 0
  ): Promise<{ summaries: OrderSummaryDisplay[]; totalCount: number; hasNextPage: boolean }> {
    try {
      const { data } = await apolloClient.query({
        query: GET_ORDER_SUMMARIES,
        variables: { limit, offset },
        errorPolicy: 'all',
        fetchPolicy: 'cache-and-network'
      })

      const summaries: OrderSummaryDisplay[] = (data?.userOrders?.orders || []).map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        itemCount: order.items?.length || 0,
        thumbnailImage: order.items?.[0]?.image
      }))

      return {
        summaries,
        totalCount: data?.userOrders?.totalCount || 0,
        hasNextPage: data?.userOrders?.hasNextPage || false
      }
    } catch (error) {
      console.error('Error fetching order summaries:', error)
      return {
        summaries: [],
        totalCount: 0,
        hasNextPage: false
      }
    }
  }

  // Check order status (lightweight query)
  static async checkOrderStatus(orderId: string): Promise<Partial<Order> | null> {
    try {
      const { data } = await apolloClient.query({
        query: CHECK_ORDER_STATUS,
        variables: { orderId },
        errorPolicy: 'all',
        fetchPolicy: 'cache-first'
      })

      return data?.order || null
    } catch (error) {
      console.error('Error checking order status:', error)
      return null
    }
  }
}