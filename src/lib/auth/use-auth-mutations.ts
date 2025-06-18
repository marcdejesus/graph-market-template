import { useMutation, useApolloClient } from '@apollo/client'
import { useRouter } from 'next/navigation'
import {
  LOGIN_MUTATION,
  REGISTER_MUTATION,
  LOGOUT_MUTATION,
  FORGOT_PASSWORD_MUTATION,
  RESET_PASSWORD_MUTATION,
  UPDATE_PROFILE_MUTATION,
  CHANGE_PASSWORD_MUTATION,
  type AuthResponse,
  type GenericResponse,
  type RegisterInput,
  type UpdateProfileInput
} from './graphql-mutations'
import { setAuthTokens, removeAuthToken } from './token-manager'

// Login hook
export function useLogin() {
  const _router = useRouter()
  const [loginMutation, { loading, error }] = useMutation<{ login: AuthResponse }>(LOGIN_MUTATION)

  const login = async (email: string, password: string): Promise<{ success: boolean; user?: any; error?: string }> => {
    try {
      const result = await loginMutation({
        variables: { email, password },
        errorPolicy: 'all'
      })

      if (result.data?.login) {
        const { accessToken, refreshToken, expiresIn, user } = result.data.login
        
        // Store tokens
        setAuthTokens({ accessToken, refreshToken, expiresIn })
        
        // Dispatch custom event for auth state update
        window.dispatchEvent(new CustomEvent('auth-token-updated', {
          detail: { token: accessToken, user }
        }))

        return { success: true, user }
      } else {
        return { success: false, error: 'Login failed' }
      }
    } catch (err: any) {
      const errorMessage = err.graphQLErrors?.[0]?.message || err.message || 'Login failed'
      return { success: false, error: errorMessage }
    }
  }

  return {
    login,
    loading,
    error
  }
}

// Register hook
export function useRegister() {
  const _router = useRouter()
  const [registerMutation, { loading, error }] = useMutation<{ register: AuthResponse }>(REGISTER_MUTATION)

  const register = async (input: RegisterInput): Promise<{ success: boolean; user?: any; error?: string }> => {
    try {
      const result = await registerMutation({
        variables: { input },
        errorPolicy: 'all'
      })

      if (result.data?.register) {
        const { accessToken, refreshToken, expiresIn, user } = result.data.register
        
        // Store tokens
        setAuthTokens({ accessToken, refreshToken, expiresIn })
        
        // Dispatch custom event for auth state update
        window.dispatchEvent(new CustomEvent('auth-token-updated', {
          detail: { token: accessToken, user }
        }))

        return { success: true, user }
      } else {
        return { success: false, error: 'Registration failed' }
      }
    } catch (err: any) {
      const errorMessage = err.graphQLErrors?.[0]?.message || err.message || 'Registration failed'
      return { success: false, error: errorMessage }
    }
  }

  return {
    register,
    loading,
    error
  }
}

// Logout hook
export function useLogout() {
  const client = useApolloClient()
  const router = useRouter()
  const [logoutMutation] = useMutation<{ logout: GenericResponse }>(LOGOUT_MUTATION)

  const logout = async (): Promise<void> => {
    try {
      // Call logout mutation (optional - some backends don't require this)
      await logoutMutation()
    } catch (error) {
      // Logout mutation failure shouldn't prevent local logout
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('Logout mutation failed:', error)
      }
    } finally {
      // Always clean up locally
      await removeAuthToken()
      await client.clearStore()
      
      // Dispatch custom event for auth state update
      window.dispatchEvent(new CustomEvent('auth-token-removed'))
      
      // Redirect to home
      router.push('/')
    }
  }

  return { logout }
}

// Forgot password hook
export function useForgotPassword() {
  const [forgotPasswordMutation, { loading, error }] = useMutation<{ forgotPassword: GenericResponse }>(FORGOT_PASSWORD_MUTATION)

  const forgotPassword = async (email: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const result = await forgotPasswordMutation({
        variables: { email },
        errorPolicy: 'all'
      })

      if (result.data?.forgotPassword?.success) {
        return { 
          success: true, 
          message: result.data.forgotPassword.message || 'Password reset email sent'
        }
      } else {
        return { 
          success: false, 
          error: result.data?.forgotPassword?.message || 'Failed to send reset email'
        }
      }
    } catch (err: any) {
      const errorMessage = err.graphQLErrors?.[0]?.message || err.message || 'Failed to send reset email'
      return { success: false, error: errorMessage }
    }
  }

  return {
    forgotPassword,
    loading,
    error
  }
}

// Reset password hook
export function useResetPassword() {
  const _router = useRouter()
  const [resetPasswordMutation, { loading, error }] = useMutation<{ resetPassword: GenericResponse }>(RESET_PASSWORD_MUTATION)

  const resetPassword = async (token: string, password: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const result = await resetPasswordMutation({
        variables: { token, password },
        errorPolicy: 'all'
      })

      if (result.data?.resetPassword?.success) {
        return { 
          success: true, 
          message: result.data.resetPassword.message || 'Password reset successfully'
        }
      } else {
        return { 
          success: false, 
          error: result.data?.resetPassword?.message || 'Failed to reset password'
        }
      }
    } catch (err: any) {
      const errorMessage = err.graphQLErrors?.[0]?.message || err.message || 'Failed to reset password'
      return { success: false, error: errorMessage }
    }
  }

  return {
    resetPassword,
    loading,
    error
  }
}

// Update profile hook
export function useUpdateProfile() {
  const [updateProfileMutation, { loading, error }] = useMutation(UPDATE_PROFILE_MUTATION)

  const updateProfile = async (input: UpdateProfileInput): Promise<{ success: boolean; user?: any; error?: string }> => {
    try {
      const result = await updateProfileMutation({
        variables: { input },
        errorPolicy: 'all',
        update: (cache, { data }) => {
          if (data?.updateProfile) {
            // Update the user in cache
            cache.modify({
              id: cache.identify(data.updateProfile),
              fields: {
                firstName: () => data.updateProfile.firstName,
                lastName: () => data.updateProfile.lastName,
                avatar: () => data.updateProfile.avatar,
                updatedAt: () => data.updateProfile.updatedAt
              }
            })
          }
        }
      })

      if (result.data?.updateProfile) {
        // Dispatch custom event for auth state update
        window.dispatchEvent(new CustomEvent('auth-profile-updated', {
          detail: { user: result.data.updateProfile }
        }))

        return { success: true, user: result.data.updateProfile }
      } else {
        return { success: false, error: 'Failed to update profile' }
      }
    } catch (err: any) {
      const errorMessage = err.graphQLErrors?.[0]?.message || err.message || 'Failed to update profile'
      return { success: false, error: errorMessage }
    }
  }

  return {
    updateProfile,
    loading,
    error
  }
}

// Change password hook
export function useChangePassword() {
  const [changePasswordMutation, { loading, error }] = useMutation<{ changePassword: GenericResponse }>(CHANGE_PASSWORD_MUTATION)

  const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      const result = await changePasswordMutation({
        variables: { currentPassword, newPassword },
        errorPolicy: 'all'
      })

      if (result.data?.changePassword?.success) {
        return { 
          success: true, 
          message: result.data.changePassword.message || 'Password changed successfully'
        }
      } else {
        return { 
          success: false, 
          error: result.data?.changePassword?.message || 'Failed to change password'
        }
      }
    } catch (err: any) {
      const errorMessage = err.graphQLErrors?.[0]?.message || err.message || 'Failed to change password'
      return { success: false, error: errorMessage }
    }
  }

  return {
    changePassword,
    loading,
    error
  }
} 