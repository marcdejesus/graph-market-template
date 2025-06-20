import { gql } from '@apollo/client'

// Order Fragments
export const ORDER_FRAGMENT = gql`
  fragment OrderDetails on Order {
    id
    orderNumber
    userId
    subtotal
    shipping
    tax
    discount
    total
    status
    paymentStatus
    createdAt
    updatedAt
    estimatedDelivery
    deliveredAt
    promoCode
    notes
    trackingNumber
    
    items {
      id
      productId
      variantId
      name
      image
      variant {
        size
        color
      }
      quantity
      unitPrice
      totalPrice
    }
    
    shippingAddress {
      id
      firstName
      lastName
      company
      addressLine1
      addressLine2
      city
      state
      zipCode
      country
      phone
    }
    
    billingAddress {
      id
      firstName
      lastName
      company
      addressLine1
      addressLine2
      city
      state
      zipCode
      country
      phone
    }
    
    shippingMethod {
      id
      name
      price
      estimatedDays
    }
    
    paymentMethod {
      type
      last4
      brand
    }
  }
`

// Create Order Mutation
export const CREATE_ORDER = gql`
  ${ORDER_FRAGMENT}
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      success
      message
      order {
        ...OrderDetails
      }
    }
  }
`

// Update Order Status Mutation
export const UPDATE_ORDER_STATUS = gql`
  ${ORDER_FRAGMENT}
  mutation UpdateOrderStatus($orderId: ID!, $status: OrderStatus!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      success
      message
      order {
        ...OrderDetails
      }
    }
  }
`

// Cancel Order Mutation
export const CANCEL_ORDER = gql`
  ${ORDER_FRAGMENT}
  mutation CancelOrder($orderId: ID!, $reason: String) {
    cancelOrder(orderId: $orderId, reason: $reason) {
      success
      message
      order {
        ...OrderDetails
      }
    }
  }
`

// Add Order Tracking Mutation
export const ADD_ORDER_TRACKING = gql`
  mutation AddOrderTracking($orderId: ID!, $trackingNumber: String!, $carrier: String) {
    addOrderTracking(orderId: $orderId, trackingNumber: $trackingNumber, carrier: $carrier) {
      success
      message
      tracking {
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
  }
`

// Process Payment Mutation
export const PROCESS_PAYMENT = gql`
  mutation ProcessPayment($orderId: ID!, $paymentMethodId: String!) {
    processPayment(orderId: $orderId, paymentMethodId: $paymentMethodId) {
      success
      message
      paymentStatus
      transactionId
    }
  }
`

// Apply Promo Code Mutation
export const APPLY_PROMO_CODE = gql`
  mutation ApplyPromoCode($orderId: ID!, $promoCode: String!) {
    applyPromoCode(orderId: $orderId, promoCode: $promoCode) {
      success
      message
      discount
      newTotal
    }
  }
`

// Reorder Mutation
export const REORDER = gql`
  ${ORDER_FRAGMENT}
  mutation Reorder($orderId: ID!) {
    reorder(orderId: $orderId) {
      success
      message
      order {
        ...OrderDetails
      }
    }
  }
` 