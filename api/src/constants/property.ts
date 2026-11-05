export const PROPERTY_STATUS = {
  AVAILABLE: 'available',
  UNDER_NEGOTIATION: 'under_negotiation',
  SOLD: 'sold',
} as const;

export type PropertyStatus =
  (typeof PROPERTY_STATUS)[keyof typeof PROPERTY_STATUS];

export const DEAL_STATUS = {
  NEGOTIATION: 'Negotiation',
  CLOSED: 'Closed',
  LOST: 'Lost',
} as const;

export type DealStatus =
  (typeof DEAL_STATUS)[keyof typeof DEAL_STATUS];


  export const PROPERTY_SORT_FIELDS = {
  TITLE: 'title',
  ADDRESS: 'address',
  BASE_PRICE: 'basePrice',
  STATUS: 'status',
} as const;

export type PropertySortField =
  (typeof PROPERTY_SORT_FIELDS)[keyof typeof PROPERTY_SORT_FIELDS];

export const SORT_DIRECTION = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortDirection =
  (typeof SORT_DIRECTION)[keyof typeof SORT_DIRECTION];