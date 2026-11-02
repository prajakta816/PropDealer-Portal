import { z } from 'zod';
import { MASTER_DATA_CATEGORIES } from '../../constants/masterData.js';

const categoryValues = Object.values(MASTER_DATA_CATEGORIES) as [string, ...string[]];

export const createMasterDataSchema = z
  .object({
    category: z.enum(categoryValues, {
      message: 'Invalid category. Must be PropertyType, City, FurnishingStatus, or DealLossReason',
    }),
    value: z
      .string()
      .trim()
      .min(1, 'Value is required')
      .max(100, 'Value cannot exceed 100 characters'),
  })
  .strict();

export const updateMasterDataSchema = z
  .object({
    category: z
      .enum(categoryValues, {
        message: 'Invalid category. Must be PropertyType, City, FurnishingStatus, or DealLossReason',
      })
      .optional(),
    value: z
      .string()
      .trim()
      .min(1, 'Value must contain at least 1 character')
      .max(100, 'Value cannot exceed 100 characters')
      .optional(),
  })
  .strict()
  .refine((data) => data.category !== undefined || data.value !== undefined, {
    message: 'At least one field (category or value) must be provided to update',
  });

export type CreateMasterDataInput = z.infer<typeof createMasterDataSchema>;
export type UpdateMasterDataInput = z.infer<typeof updateMasterDataSchema>;