export const ROLES = {
  ADMIN: 'Admin',
  AGENT: 'Agent',
  COMMISSION_MANAGER: 'CommissionManager',
} as const

export type UserRole = (typeof ROLES)[keyof typeof ROLES]