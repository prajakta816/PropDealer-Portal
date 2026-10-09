export const ROLES = {
  ADMIN: 'Admin',
  AGENT: 'Agent',
  COMMISSION_MANAGER: 'CommissionManager',
  BUYER: 'Buyer',
} as const

export type UserRole = (typeof ROLES)[keyof typeof ROLES]