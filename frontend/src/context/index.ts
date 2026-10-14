export { AuthProvider } from './AuthContext'
export { useAuth } from './useAuth'
export {
  USERS_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  SEEDED_ADMIN_CREDENTIALS,
  DEFAULT_ADMIN,
  hashPassword,
  initializeStorage,
} from './authConstants'
export type { User, StoredUser } from './authConstants'
export type { AuthContextType } from './authContextDef'
//this file serves as a central export point for the authentication-related context, hooks, constants, and types. It allows other parts of the application to import these functionalities from a single location, improving code organization and maintainability.