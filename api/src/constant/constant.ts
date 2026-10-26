// api/src/constants/constant.ts

export const ROLES = {
  ADMIN: 'Admin',
  AGENT: 'Agent',
  COMMISSION_MANAGER: 'CommissionManager',
} as const

export type UserRole = (typeof ROLES)[keyof typeof ROLES]

export const ENTITY_TYPES = {
  USER: 'User',
  BUYER: 'Buyer',
} as const

export type EntityType =
  (typeof ENTITY_TYPES)[keyof typeof ENTITY_TYPES]