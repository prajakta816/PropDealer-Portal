export const MASTER_DATA_CATEGORIES = {
    PROPERTY_TYPE: 'PropertyType',
    CITY: 'City',
    FURNISHING_STATUS: 'FurnishingStatus',
    DEAL_LOSS_REASON: 'DealLossReason',
} as const

export type MasterDataCategory =
    (typeof MASTER_DATA_CATEGORIES)[keyof typeof MASTER_DATA_CATEGORIES]

export const MASTER_DATA_CATEGORY_OPTIONS = [
    { label: 'City', value: MASTER_DATA_CATEGORIES.CITY },
    { label: 'Property Type', value: MASTER_DATA_CATEGORIES.PROPERTY_TYPE },
    { label: 'Furnishing Status', value: MASTER_DATA_CATEGORIES.FURNISHING_STATUS },
    { label: 'Deal Loss Reason', value: MASTER_DATA_CATEGORIES.DEAL_LOSS_REASON },
] as const

export const ALL_CATEGORIES_FILTER = 'all' as const