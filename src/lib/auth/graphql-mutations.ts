import { gql } from '@apollo/client'

// Login mutation
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
      expiresIn
      user {
        id
        email
        firstName
        lastName
        avatar
        createdAt
        updatedAt
      }
    }
  }
`

// Register mutation
export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      refreshToken
      expiresIn
      user {
        id
        email
        firstName
        lastName
        avatar
        createdAt
        updatedAt
      }
    }
  }
`

// Refresh token mutation
export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
      expiresIn
    }
  }
`

// Logout mutation
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`

// Forgot password mutation
export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email) {
      success
      message
    }
  }
`

// Reset password mutation
export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password) {
      success
      message
    }
  }
`

// Get current user query
export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      firstName
      lastName
      avatar
      createdAt
      updatedAt
    }
  }
`

// Update profile mutation
export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      firstName
      lastName
      avatar
      updatedAt
    }
  }
`

// Change password mutation
export const CHANGE_PASSWORD_MUTATION = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      success
      message
    }
  }
`

// GraphQL Input Types
export interface RegisterInput {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface UpdateProfileInput {
  firstName?: string
  lastName?: string
  avatar?: string
}

// GraphQL Response Types
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    avatar?: string
    createdAt: string
    updatedAt: string
  }
}

export interface GenericResponse {
  success: boolean
  message: string
} 