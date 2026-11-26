import type { AuditUserInfo } from './properties'

export const DEAL_STATUS = {
  NEGOTIATION: 'Negotiation',
  CLOSED: 'Closed',
  LOST: 'Lost',
} as const

export type DealStatus = (typeof DEAL_STATUS)[keyof typeof DEAL_STATUS]

export interface DealPropertySummary {
  id: string
  title: string
  address: string
  basePrice: number
}

export interface DealBuyerSummary {
  id: string
  name: string
  email: string
}

export interface Deal {
  id: string
  propertyId: string
  buyerId: string
  dealPrice: number
  status: DealStatus
  createdAt: string
  createdById?: string | null
  createdBy?: AuditUserInfo | null
  updatedAt: string
  updatedById?: string | null
  updatedBy?: AuditUserInfo | null
  property?: DealPropertySummary
  buyer?: DealBuyerSummary
}