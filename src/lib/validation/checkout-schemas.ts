import { z } from 'zod'

// Address validation schema
export const addressSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  
  company: z.string()
    .max(100, 'Company name must be less than 100 characters')
    .optional(),
  
  address1: z.string()
    .min(1, 'Street address is required')
    .max(100, 'Street address must be less than 100 characters'),
  
  address2: z.string()
    .max(100, 'Address line 2 must be less than 100 characters')
    .optional(),
  
  city: z.string()
    .min(1, 'City is required')
    .max(50, 'City must be less than 50 characters'),
  
  province: z.string()
    .min(1, 'State/Province is required')
    .max(50, 'State/Province must be less than 50 characters'),
  
  country: z.string()
    .min(1, 'Country is required')
    .max(50, 'Country must be less than 50 characters'),
  
  zip: z.string()
    .min(1, 'ZIP/Postal code is required')
    .max(20, 'ZIP/Postal code must be less than 20 characters')
    .regex(/^[A-Za-z0-9\s-]+$/, 'Invalid ZIP/Postal code format'),
  
  phone: z.string()
    .max(20, 'Phone number must be less than 20 characters')
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number format')
    .optional()
})

// Shipping information schema
export const shippingInfoSchema = z.object({
  address: addressSchema,
  
  method: z.object({
    id: z.string().min(1, 'Shipping method is required'),
    name: z.string(),
    description: z.string(),
    price: z.number().min(0),
    estimatedDays: z.number().min(0),
    isDefault: z.boolean().optional()
  }),
  
  instructions: z.string()
    .max(500, 'Delivery instructions must be less than 500 characters')
    .optional()
})

// Payment card schema
export const paymentCardSchema = z.object({
  cardNumber: z.string()
    .min(1, 'Card number is required')
    .regex(/^[0-9\s-]+$/, 'Invalid card number format')
    .transform(val => val.replace(/[\s-]/g, '')) // Remove spaces and dashes
    .refine(val => val.length >= 13 && val.length <= 19, 'Card number must be 13-19 digits'),
  
  expiryMonth: z.number()
    .min(1, 'Expiry month must be between 1 and 12')
    .max(12, 'Expiry month must be between 1 and 12'),
  
  expiryYear: z.number()
    .min(new Date().getFullYear(), 'Card has expired')
    .max(new Date().getFullYear() + 20, 'Invalid expiry year'),
  
  cvv: z.string()
    .min(3, 'CVV must be at least 3 digits')
    .max(4, 'CVV must be at most 4 digits')
    .regex(/^[0-9]+$/, 'CVV must contain only numbers'),
  
  cardholderName: z.string()
    .min(1, 'Cardholder name is required')
    .max(100, 'Cardholder name must be less than 100 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Cardholder name must contain only letters and spaces')
})

// Payment information schema
export const paymentInfoSchema = z.discriminatedUnion('type', [
  // Credit/Debit Card
  z.object({
    type: z.literal('card'),
    ...paymentCardSchema.shape,
    billingAddress: addressSchema.optional(),
    saveCard: z.boolean().optional()
  }),
  
  // PayPal
  z.object({
    type: z.literal('paypal'),
    email: z.string().email('Invalid PayPal email address').optional()
  }),
  
  // Apple Pay
  z.object({
    type: z.literal('apple_pay'),
    deviceId: z.string().optional()
  }),
  
  // Google Pay
  z.object({
    type: z.literal('google_pay'),
    accountId: z.string().optional()
  })
])

// Order summary schema
export const orderSummarySchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().positive(),
    size: z.string().optional(),
    color: z.string().optional(),
    imageUrl: z.string().url(),
    maxQuantity: z.number().positive()
  })).min(1, 'Cart cannot be empty'),
  
  subtotal: z.number().min(0),
  shipping: z.number().min(0),
  tax: z.number().min(0),
  discount: z.number().min(0),
  total: z.number().positive(),
  promoCode: z.string().optional(),
  estimatedDelivery: z.date()
})

// Complete checkout validation schema
export const checkoutSchema = z.object({
  shippingInfo: shippingInfoSchema,
  paymentInfo: paymentInfoSchema,
  orderSummary: orderSummarySchema,
  termsAccepted: z.boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
  marketingOptIn: z.boolean().optional()
})

// Promo code schema
export const promoCodeSchema = z.object({
  code: z.string()
    .min(1, 'Promo code is required')
    .max(20, 'Promo code must be less than 20 characters')
    .regex(/^[A-Z0-9]+$/, 'Promo code must contain only uppercase letters and numbers')
})

// Order placement schema
export const orderInputSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().positive(),
    price: z.number().positive()
  })),
  
  shippingAddress: addressSchema,
  billingAddress: addressSchema.optional(),
  shippingMethod: z.string(),
  
  paymentMethod: z.object({
    type: z.enum(['card', 'paypal', 'apple_pay', 'google_pay']),
    details: z.record(z.any())
  }),
  
  promoCode: z.string().optional(),
  subtotal: z.number().min(0),
  shipping: z.number().min(0),
  tax: z.number().min(0),
  total: z.number().positive()
})

// Validation helper functions
export const validateField = <T>(schema: z.ZodSchema<T>, value: unknown): { 
  isValid: boolean
  error?: string 
} => {
  try {
    schema.parse(value)
    return { isValid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        error: error.errors[0]?.message || 'Validation failed' 
      }
    }
    return { isValid: false, error: 'Validation failed' }
  }
}

export const validateForm = <T>(schema: z.ZodSchema<T>, formData: unknown): { 
  isValid: boolean
  errors: Record<string, string>
  data?: T
} => {
  try {
    const data = schema.parse(formData)
    return { isValid: true, errors: {}, data }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {}
      error.errors.forEach(err => {
        const path = err.path.join('.')
        errors[path] = err.message
      })
      return { isValid: false, errors }
    }
    return { isValid: false, errors: { general: 'Validation failed' } }
  }
}

// Type exports for form data
export type AddressFormData = z.infer<typeof addressSchema>
export type ShippingInfoFormData = z.infer<typeof shippingInfoSchema>
export type PaymentInfoFormData = z.infer<typeof paymentInfoSchema>
export type OrderSummaryFormData = z.infer<typeof orderSummarySchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>
export type PromoCodeFormData = z.infer<typeof promoCodeSchema>
export type OrderInputFormData = z.infer<typeof orderInputSchema> 