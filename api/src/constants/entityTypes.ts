export const ENTITY_TYPES = {
  USER: 'User',
  BUYER: 'Buyer',
} as const;

export type EntityType =(typeof ENTITY_TYPES)[keyof typeof ENTITY_TYPES];