import { z } from 'zod'
import { ADDRESS_PATTERNS, SUPPORTED_COUNTRIES } from '@/types/address'

// Base address schema
export const baseAddressSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
  
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
    .max(50, 'City must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-\.]+$/, 'City contains invalid characters'),
  
  province: z.string()
    .min(1, 'State/Province is required')
    .max(50, 'State/Province must be less than 50 characters'),
  
  country: z.string()
    .min(1, 'Country is required')
    .refine(
      (country) => SUPPORTED_COUNTRIES.some(c => c.name === country || c.code === country),
      'Please select a supported country'
    ),
  
  zip: z.string()
    .min(1, 'ZIP/Postal code is required'),
  
  phone: z.string()
    .regex(ADDRESS_PATTERNS.PHONE, 'Please enter a valid phone number')
    .optional()
    .or(z.literal(''))
})

// Enhanced address schema with dynamic validation based on country
export const addressSchema = baseAddressSchema.superRefine((data, ctx) => {
  const country = SUPPORTED_COUNTRIES.find(c => c.name === data.country || c.code === data.country)
  
  if (country) {
    // Validate ZIP/Postal code based on country
    if (!country.zipPattern.test(data.zip)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Please enter a valid ${country.name} postal code (e.g., ${country.zipPlaceholder})`,
        path: ['zip']
      })
    }
  }
  
  // Additional validations
  if (data.firstName && data.lastName && data.firstName.toLowerCase() === data.lastName.toLowerCase()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'First name and last name cannot be the same',
      path: ['lastName']
    })
  }
})

// Saved address schema (includes metadata) - built from base schema
export const savedAddressSchema = z.object({
  firstName: z.string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  
  lastName: z.string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
  
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
    .max(50, 'City must be less than 50 characters')
    .regex(/^[a-zA-Z\s'-\.]+$/, 'City contains invalid characters'),
  
  province: z.string()
    .min(1, 'State/Province is required')
    .max(50, 'State/Province must be less than 50 characters'),
  
  country: z.string()
    .min(1, 'Country is required')
    .refine(
      (country) => SUPPORTED_COUNTRIES.some(c => c.name === country || c.code === country),
      'Please select a supported country'
    ),
  
  zip: z.string()
    .min(1, 'ZIP/Postal code is required'),
  
  phone: z.string()
    .regex(ADDRESS_PATTERNS.PHONE, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  
  nickname: z.string()
    .max(50, 'Nickname must be less than 50 characters')
    .optional(),
  
  isDefault: z.boolean()
    .default(false)
}).superRefine((data, ctx) => {
  const country = SUPPORTED_COUNTRIES.find(c => c.name === data.country || c.code === data.country)
  
  if (country) {
    // Validate ZIP/Postal code based on country
    if (!country.zipPattern.test(data.zip)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Please enter a valid ${country.name} postal code (e.g., ${country.zipPlaceholder})`,
        path: ['zip']
      })
    }
  }
  
  // Additional validations
  if (data.firstName && data.lastName && data.firstName.toLowerCase() === data.lastName.toLowerCase()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'First name and last name cannot be the same',
      path: ['lastName']
    })
  }
})

// Address form data schema
export const addressFormSchema = savedAddressSchema

// Create address input schema
export const createAddressSchema = savedAddressSchema

// Update address input schema
export const updateAddressSchema = savedAddressSchema.and(z.object({
  id: z.string().min(1, 'Address ID is required')
}))

// Address search schema
export const addressSearchSchema = z.object({
  query: z.string().optional(),
  country: z.string().optional(),
  isDefault: z.boolean().optional(),
  isVerified: z.boolean().optional()
})

// Address verification schema (for external API calls)
export const addressVerificationSchema = z.object({
  address: addressSchema,
  verifyWithService: z.boolean().default(true),
  returnSuggestions: z.boolean().default(true)
})

// Bulk address validation schema
export const bulkAddressSchema = z.object({
  addresses: z.array(addressSchema).min(1).max(100)
})

// Quick address schema (for autocomplete/search)
export const quickAddressSchema = z.object({
  query: z.string().min(3, 'Please enter at least 3 characters'),
  country: z.string().optional(),
  limit: z.number().min(1).max(20).default(10)
})

// Address standardization schema
export const addressStandardizationSchema = z.object({
  address: baseAddressSchema,
  standardize: z.boolean().default(true),
  validateComponents: z.boolean().default(true)
})

// Type exports
export type AddressFormData = z.infer<typeof addressFormSchema>
export type CreateAddressData = z.infer<typeof createAddressSchema>
export type UpdateAddressData = z.infer<typeof updateAddressSchema>
export type AddressSearchData = z.infer<typeof addressSearchSchema>
export type AddressVerificationData = z.infer<typeof addressVerificationSchema>
export type QuickAddressData = z.infer<typeof quickAddressSchema>

// Validation helper functions
export function validateAddress(address: unknown): { success: boolean; data?: AddressFormData; errors?: Record<string, string[]> } {
  const result = addressFormSchema.safeParse(address)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  const errors: Record<string, string[]> = {}
  result.error.issues.forEach((issue: z.ZodIssue) => {
    const path = issue.path.join('.')
    if (!errors[path]) {
      errors[path] = []
    }
    errors[path].push(issue.message)
  })
  
  return { success: false, errors }
}

export function validateAddressField(field: string, value: unknown, address?: Partial<AddressFormData>): string | null {
  try {
    const fullAddress = { ...address, [field]: value }
    const result = addressFormSchema.safeParse(fullAddress)
    
    if (result.success) {
      return null
    }
    
    const fieldError = result.error.issues.find((issue: z.ZodIssue) => 
      issue.path.includes(field)
    )
    
    return fieldError?.message || null
  } catch {
    return 'Invalid value'
  }
}

// Address normalization helper
export function normalizeAddress(address: AddressFormData): AddressFormData {
  return {
    ...address,
    firstName: address.firstName.trim(),
    lastName: address.lastName.trim(),
    company: address.company?.trim(),
    address1: address.address1.trim(),
    address2: address.address2?.trim(),
    city: address.city.trim(),
    province: address.province.trim(),
    country: address.country.trim(),
    zip: address.zip.trim().toUpperCase(),
    phone: address.phone?.trim(),
    nickname: address.nickname?.trim()
  }
} 