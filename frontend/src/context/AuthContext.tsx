import { useState, type ReactNode } from 'react'
import type { UserRole } from '../constants/roles'
import {
  USERS_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  DEFAULT_ADMIN,
  type User,
  type StoredUser,
  hashPassword,
  initializeStorage,
} from './authConstants'
import { AuthContext } from './authContextDef'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    initializeStorage()
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY)
    if (storedSession) {
      try {
        return JSON.parse(storedSession) as User
      } catch {
        localStorage.removeItem(SESSION_STORAGE_KEY)
      }
    }
    return null
  })

  const [isLoading] = useState<boolean>(false)

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    initializeStorage()
    const rawUsers = localStorage.getItem(USERS_STORAGE_KEY)
    const users: StoredUser[] = rawUsers ? JSON.parse(rawUsers) : [DEFAULT_ADMIN]

    const targetUser = users.find(
      (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
    )

    if (!targetUser) {
      return { success: false, message: 'No registered account found with this email address.' }
    }

    const inputHash = await hashPassword(password)
    if (targetUser.passwordHash !== inputHash) {
      return { success: false, message: 'Invalid password. Please check your credentials.' }
    }

    const sessionUser: User = {
      id: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      createdAt: targetUser.createdAt,
    }

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionUser))
    setUser(sessionUser)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    setUser(null)
  }

  const hasRole = (allowedRoles: UserRole[]): boolean => {
    if (!user) return false
    return allowedRoles.includes(user.role)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
