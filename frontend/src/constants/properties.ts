export type PropertyStatus = 'available' | 'under_negotiation' | 'sold'

export interface AuditUserInfo {
  id: string
  name: string
  email: string
}

export interface Property {
  id: string
  title: string
  address: string
  basePrice: number
  status: PropertyStatus
  createdAt: string
  createdById?: string | null
  createdBy?: AuditUserInfo | null
  updatedAt?: string
  updatedById?: string | null
  updatedBy?: AuditUserInfo | null
}

export const PROPERTIES_STORAGE_KEY = 'propdealer_properties'

export const PROPERTY_STATUS_CONFIG: Record<
  PropertyStatus,
  { label: string; color: 'success' | 'warning' | 'default' }
> = {
  available: {
    label: 'Available',
    color: 'success',
  },
  under_negotiation: {
    label: 'Under Negotiation',
    color: 'warning',
  },
  sold: {
    label: 'Sold',
    color: 'default',
  },
}


export const PROPERTY_SORT_FIELDS = {
  TITLE: 'title',
  ADDRESS: 'address',
  BASE_PRICE: 'basePrice',
  STATUS: 'status',
} as const

export type PropertySortField =
  (typeof PROPERTY_SORT_FIELDS)[keyof typeof PROPERTY_SORT_FIELDS]

export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const

export type SortDirection =
  (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS]