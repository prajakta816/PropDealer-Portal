import { createContext } from 'react'
import type { UserRole } from '../constants/roles'
import type { User } from './authConstants'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  hasRole: (allowedRoles: UserRole[]) => boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)//AuthContext is a React context that holds the authentication state and functions for the application            
                                         //So TypeScript knows exactly what data exists inside the context.