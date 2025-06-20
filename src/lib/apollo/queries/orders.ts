import { gql } from '@apollo/client'
import { ORDER_FRAGMENT } from '../mutations/order'

// Get User Orders Query
export const GET_USER_ORDERS = gql`
  ${ORDER_FRAGMENT}
  query GetUserOrders(
    $limit: Int
    $offset: Int
    $filters: OrderFilters
  ) {
    userOrders(limit: $limit, offset: $offset, filters: $filters) {
      orders {
        ...OrderDetails
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
`

// Get Single Order Query
export const GET_ORDER = gql`
  ${ORDER_FRAGMENT}
  query GetOrder($orderId: ID!) {
    order(id: $orderId) {
      ...OrderDetails
    }
  }
`

// Get Order by Order Number Query
export const GET_ORDER_BY_NUMBER = gql`
  ${ORDER_FRAGMENT}
  query GetOrderByNumber($orderNumber: String!) {
    orderByNumber(orderNumber: $orderNumber) {
      ...OrderDetails
    }
  }
`

// Get Order Tracking Query
export const GET_ORDER_TRACKING = gql`
  query GetOrderTracking($orderId: ID!) {
    orderTracking(orderId: $orderId) {
      orderId
      trackingNumber
      carrier
      status
      estimatedDelivery
      events {
        status
        description
        location
        timestamp
      }
    }
  }
`

// Get Order Summary Query (for lists)
export const GET_ORDER_SUMMARIES = gql`
  query GetOrderSummaries($limit: Int, $offset: Int) {
    userOrders(limit: $limit, offset: $offset) {
      orders {
        id
        orderNumber
        total
        status
        createdAt
        items {
          id
          name
          image
          quantity
        }
      }
      totalCount
      hasNextPage
      hasPreviousPage
    }
  }
`

// Check Order Status Query
export const CHECK_ORDER_STATUS = gql`
  query CheckOrderStatus($orderId: ID!) {
    order(id: $orderId) {
      id
      orderNumber
      status
      paymentStatus
      estimatedDelivery
      trackingNumber
      updatedAt
    }
  }
` 