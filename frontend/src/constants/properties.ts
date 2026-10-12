export type PropertyStatus = 'available' | 'under_negotiation' | 'sold'

export interface Property {
  id: string
  title: string
  address: string
  basePrice: number
  status: PropertyStatus
  createdAt: string
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

//export const DEFAULT_PROPERTIES: Property[] = []
