'use client'

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import { SavedAddress, AddressBookState, AddressBookAction, CreateAddressInput, UpdateAddressInput, AddressFormData } from '@/types/address'
import { normalizeAddress } from '@/lib/validation/address-schemas'

// Address book context interface
interface AddressBookContextType {
  state: AddressBookState
  addresses: SavedAddress[]
  defaultAddress: SavedAddress | null
  isLoading: boolean
  error: string | null
  
  // CRUD operations
  createAddress: (input: CreateAddressInput) => Promise<SavedAddress>
  updateAddress: (input: UpdateAddressInput) => Promise<SavedAddress>
  deleteAddress: (id: string) => Promise<void>
  setDefaultAddress: (id: string) => Promise<void>
  
  // Utility functions
  getAddressById: (id: string) => SavedAddress | null
  getAddressesByCountry: (country: string) => SavedAddress[]
  clearError: () => void
  refreshAddresses: () => Promise<void>
}

// Initial state
const initialState: AddressBookState = {
  addresses: [],
  isLoading: false,
  error: null,
  lastUpdated: null
}

// Address book reducer
function addressBookReducer(state: AddressBookState, action: AddressBookAction): AddressBookState {
  switch (action.type) {
    case 'SET_ADDRESSES':
      return {
        ...state,
        addresses: action.payload,
        lastUpdated: new Date(),
        error: null
      }
    
    case 'ADD_ADDRESS':
      return {
        ...state,
        addresses: [...state.addresses, action.payload],
        lastUpdated: new Date(),
        error: null
      }
    
    case 'UPDATE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map(addr => 
          addr.id === action.payload.id ? action.payload : addr
        ),
        lastUpdated: new Date(),
        error: null
      }
    
    case 'DELETE_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.filter(addr => addr.id !== action.payload),
        lastUpdated: new Date(),
        error: null
      }
    
    case 'SET_DEFAULT_ADDRESS':
      return {
        ...state,
        addresses: state.addresses.map(addr => ({
          ...addr,
          isDefault: addr.id === action.payload
        })),
        lastUpdated: new Date(),
        error: null
      }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      }
    
    default:
      return state
  }
}

// Create context
const AddressBookContext = createContext<AddressBookContextType | undefined>(undefined)

// Mock data for development
const MOCK_ADDRESSES: SavedAddress[] = [
  {
    id: 'addr_1',
    firstName: 'John',
    lastName: 'Doe',
    company: 'FitCorp Inc.',
    address1: '123 Main Street',
    address2: 'Suite 100',
    city: 'New York',
    province: 'NY',
    country: 'United States',
    zip: '10001',
    phone: '(555) 123-4567',
    nickname: 'Home',
    isDefault: true,
    userId: 'user_1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    isVerified: true,
    verificationStatus: 'verified'
  },
  {
    id: 'addr_2',
    firstName: 'John',
    lastName: 'Doe',
    company: 'FitCorp Inc.',
    address1: '456 Business Ave',
    city: 'Los Angeles',
    province: 'CA',
    country: 'United States',
    zip: '90210',
    phone: '(555) 987-6543',
    nickname: 'Office',
    isDefault: false,
    userId: 'user_1',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    isVerified: true,
    verificationStatus: 'verified'
  }
]

// Mock API functions
const mockAPI = {
  async getAddresses(): Promise<SavedAddress[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return MOCK_ADDRESSES
  },

  async createAddress(input: CreateAddressInput): Promise<SavedAddress> {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const normalizedInput = normalizeAddress({
      ...input,
      isDefault: input.isDefault ?? false
    })
    
    const newAddress: SavedAddress = {
      id: `addr_${Date.now()}`,
      ...normalizedInput,
      isDefault: input.isDefault ?? false,
      userId: 'user_1',
      createdAt: new Date(),
      updatedAt: new Date(),
      isVerified: false,
      verificationStatus: 'unverified'
    }
    
    // Add to mock data
    MOCK_ADDRESSES.push(newAddress)
    
    // If this is set as default, make others non-default
    if (input.isDefault) {
      MOCK_ADDRESSES.forEach(addr => {
        if (addr.id !== newAddress.id) {
          addr.isDefault = false
        }
      })
    }
    
    return newAddress
  },

  async updateAddress(input: UpdateAddressInput): Promise<SavedAddress> {
    await new Promise(resolve => setTimeout(resolve, 600))
    
    const index = MOCK_ADDRESSES.findIndex(addr => addr.id === input.id)
    if (index === -1) {
      throw new Error('Address not found')
    }
    
    const normalizedInput = normalizeAddress({
      ...input,
      isDefault: input.isDefault ?? false
    })
    
    const updatedAddress: SavedAddress = {
      ...MOCK_ADDRESSES[index],
      ...normalizedInput,
      id: input.id,
      isDefault: input.isDefault ?? false,
      updatedAt: new Date()
    }
    
    MOCK_ADDRESSES[index] = updatedAddress
    
    // If this is set as default, make others non-default
    if (input.isDefault) {
      MOCK_ADDRESSES.forEach(addr => {
        if (addr.id !== updatedAddress.id) {
          addr.isDefault = false
        }
      })
    }
    
    return updatedAddress
  },

  async deleteAddress(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400))
    
    const index = MOCK_ADDRESSES.findIndex(addr => addr.id === id)
    if (index === -1) {
      throw new Error('Address not found')
    }
    
    const wasDefault = MOCK_ADDRESSES[index].isDefault
    MOCK_ADDRESSES.splice(index, 1)
    
    // If deleted address was default, make the first remaining address default
    if (wasDefault && MOCK_ADDRESSES.length > 0) {
      MOCK_ADDRESSES[0].isDefault = true
    }
  },

  async setDefaultAddress(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const address = MOCK_ADDRESSES.find(addr => addr.id === id)
    if (!address) {
      throw new Error('Address not found')
    }
    
    // Update all addresses
    MOCK_ADDRESSES.forEach(addr => {
      addr.isDefault = addr.id === id
      if (addr.id === id) {
        addr.updatedAt = new Date()
      }
    })
  }
}

// Provider component
export function AddressBookProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(addressBookReducer, initialState)

  // Load addresses on mount
  useEffect(() => {
    loadAddresses()
  }, [])

  const loadAddresses = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const addresses = await mockAPI.getAddresses()
      dispatch({ type: 'SET_ADDRESSES', payload: addresses })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load addresses' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const createAddress = useCallback(async (input: CreateAddressInput): Promise<SavedAddress> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })
    
    try {
      const newAddress = await mockAPI.createAddress(input)
      dispatch({ type: 'ADD_ADDRESS', payload: newAddress })
      return newAddress
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create address'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const updateAddress = useCallback(async (input: UpdateAddressInput): Promise<SavedAddress> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })
    
    try {
      const updatedAddress = await mockAPI.updateAddress(input)
      dispatch({ type: 'UPDATE_ADDRESS', payload: updatedAddress })
      return updatedAddress
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update address'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const deleteAddress = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })
    
    try {
      await mockAPI.deleteAddress(id)
      dispatch({ type: 'DELETE_ADDRESS', payload: id })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete address'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const setDefaultAddress = useCallback(async (id: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })
    
    try {
      await mockAPI.setDefaultAddress(id)
      dispatch({ type: 'SET_DEFAULT_ADDRESS', payload: id })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to set default address'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  // Utility functions
  const getAddressById = useCallback((id: string): SavedAddress | null => {
    return state.addresses.find(addr => addr.id === id) || null
  }, [state.addresses])

  const getAddressesByCountry = useCallback((country: string): SavedAddress[] => {
    return state.addresses.filter(addr => addr.country === country)
  }, [state.addresses])

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' })
  }, [])

  const refreshAddresses = useCallback(async (): Promise<void> => {
    await loadAddresses()
  }, [loadAddresses])

  // Computed values
  const defaultAddress = state.addresses.find(addr => addr.isDefault) || null

  const value: AddressBookContextType = {
    state,
    addresses: state.addresses,
    defaultAddress,
    isLoading: state.isLoading,
    error: state.error,
    
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    
    getAddressById,
    getAddressesByCountry,
    clearError,
    refreshAddresses
  }

  return (
    <AddressBookContext.Provider value={value}>
      {children}
    </AddressBookContext.Provider>
  )
}

// Hook to use address book context
export function useAddressBook(): AddressBookContextType {
  const context = useContext(AddressBookContext)
  if (context === undefined) {
    throw new Error('useAddressBook must be used within an AddressBookProvider')
  }
  return context
} 