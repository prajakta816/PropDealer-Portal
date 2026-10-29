import { type UserRole } from '../constants/roles'
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

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()//textencoder is a built-in JavaScript class that converts a string into a Uint8Array of bytes, which is necessary for cryptographic operations like hashing.
  const data = encoder.encode(password)//encode method of the TextEncoder instance is used to convert the password string into a Uint8Array of bytes, which is then passed to the crypto.subtle.digest method for hashing.
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)//subtle is a property of the web crypto api  .digest method is used to compute the SHA-256 hash of the input data (the encoded password). It returns a promise that resolves to an ArrayBuffer containing the hash.
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

