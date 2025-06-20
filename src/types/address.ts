import { Address } from './index'

// Extended address interface for saved addresses
export interface SavedAddress extends Address {
  id: string
  nickname?: string
  isDefault: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
  isVerified?: boolean
  verificationStatus?: 'verified' | 'unverified' | 'failed'
}

// Address form data (without system fields)
export interface AddressFormData {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province: string
  country: string
  zip: string
  phone?: string
  nickname?: string
  isDefault?: boolean
}

// Address validation result
export interface AddressValidationResult {
  isValid: boolean
  errors: Record<string, string>
  suggestions?: AddressFormData[]
  confidence?: number
}

// Address verification result (from external services)
export interface AddressVerificationResult {
  isValid: boolean
  isVerified: boolean
  confidence: number
  standardizedAddress?: AddressFormData
  suggestions: AddressFormData[]
  errors: string[]
}

// Address book state
export interface AddressBookState {
  addresses: SavedAddress[]
  isLoading: boolean
  error: string | null
  lastUpdated: Date | null
}

// Address book actions
export type AddressBookAction =
  | { type: 'SET_ADDRESSES'; payload: SavedAddress[] }
  | { type: 'ADD_ADDRESS'; payload: SavedAddress }
  | { type: 'UPDATE_ADDRESS'; payload: SavedAddress }
  | { type: 'DELETE_ADDRESS'; payload: string }
  | { type: 'SET_DEFAULT_ADDRESS'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' }

// Address input for creation/updates
export interface CreateAddressInput {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  province: string
  country: string
  zip: string
  phone?: string
  nickname?: string
  isDefault?: boolean
}

export interface UpdateAddressInput extends CreateAddressInput {
  id: string
}

// Address search/filter options
export interface AddressSearchOptions {
  query?: string
  country?: string
  isDefault?: boolean
  isVerified?: boolean
}

// Address form modes
export type AddressFormMode = 'create' | 'edit' | 'view'

// Common address patterns for validation
export const ADDRESS_PATTERNS = {
  US_ZIP: /^\d{5}(-\d{4})?$/,
  CA_POSTAL: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
  UK_POSTAL: /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s?\d[A-Za-z]{2}$/,
  PHONE: /^[\+]?[\d\s\-\(\)]{10,}$/
}

// Supported countries with their specific validation rules
export const SUPPORTED_COUNTRIES = [
  {
    code: 'US',
    name: 'United States',
    hasStates: true,
    zipPattern: ADDRESS_PATTERNS.US_ZIP,
    zipPlaceholder: '12345 or 12345-6789'
  },
  {
    code: 'CA',
    name: 'Canada',
    hasStates: true,
    zipPattern: ADDRESS_PATTERNS.CA_POSTAL,
    zipPlaceholder: 'K1A 0A6'
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    hasStates: false,
    zipPattern: ADDRESS_PATTERNS.UK_POSTAL,
    zipPlaceholder: 'SW1A 1AA'
  }
] as const

export type SupportedCountryCode = typeof SUPPORTED_COUNTRIES[number]['code'] 