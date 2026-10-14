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
  email: SEEDED_ADMIN_CREDENTIALS.email,//why we directly didnt write the email here becaouse we want to keep the email consistent with the seeded credentials and avoid duplication. If the email in SEEDED_ADMIN_CREDENTIALS changes, it will automatically reflect here without needing to update it in multiple places.
  passwordHash: 'e86f78a8a3caf0b60d8e74e5942aa6d86dc150cd3c03338aef25b7d2d7e3acc7',
  role: ROLES.ADMIN,
  createdAt: new Date().toISOString(),
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()//textencoder is a built-in JavaScript class that converts a string into a Uint8Array of bytes, which is necessary for cryptographic operations like hashing.
  const data = encoder.encode(password)//encode method of the TextEncoder instance is used to convert the password string into a Uint8Array of bytes, which is then passed to the crypto.subtle.digest method for hashing.
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)//subtle is a property of the web crypto api  .digest method is used to compute the SHA-256 hash of the input data (the encoded password). It returns a promise that resolves to an ArrayBuffer containing the hash.
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
