import { ROLES, type UserRole } from '../constants/roles'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface StoredUser extends User {
  passwordHash: string
}

export const USERS_STORAGE_KEY = 'propdealer_users'
export const SESSION_STORAGE_KEY = 'propdealer_session'

export const SEEDED_ADMIN_CREDENTIALS = {
  email: 'admin@propdealer.com',
  password: 'Admin@123',
}

export const DEFAULT_ADMIN: StoredUser = {
  id: 'usr_admin_001',
  name: 'System Administrator',
  email: SEEDED_ADMIN_CREDENTIALS.email,
  passwordHash: 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7',
  role: ROLES.ADMIN,
  createdAt: new Date().toISOString(),
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

export function initializeStorage(): void {
  const existingUsers = localStorage.getItem(USERS_STORAGE_KEY)
  if (!existingUsers) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_ADMIN]))
    return
  }
  try {
    const parsed: StoredUser[] = JSON.parse(existingUsers)
    const hasAdmin = parsed.some((u) => u.email.toLowerCase() === DEFAULT_ADMIN.email.toLowerCase())
    if (!hasAdmin) {
      parsed.push(DEFAULT_ADMIN)
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed))
    }
  } catch {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([DEFAULT_ADMIN]))
  }
}
