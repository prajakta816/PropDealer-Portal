export const MASTER_DATA_CATEGORIES = {
  CITY: 'City',
  PROPERTY_TYPE: 'PropertyType',
  FURNISHING_STATUS: 'FurnishingStatus',
  DEAL_LOSS_REASON: 'DealLossReason',
} as const;

export type MasterDataCategory =
  (typeof MASTER_DATA_CATEGORIES)[keyof typeof MASTER_DATA_CATEGORIES];