import { useContext } from 'react'
import { AuthContext, type AuthContextType } from './authContextDef'

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)//useContext is a React hook that allows functional components to access the value of a context. In this case, it retrieves the current value of the AuthContext, which contains authentication-related data and functions.
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
