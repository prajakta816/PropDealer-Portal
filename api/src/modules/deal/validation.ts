import { z } from 'zod';
import { DEAL_STATUS } from '../../constants/property.js';


export const createDealBodySchema = z
  .object({
    buyerId: z
      .string({ message: 'Buyer ID is required' })
      .uuid('Invalid buyer ID format'),
    dealPrice: z
      .number({ message: 'Deal price must be a number' })
      .int('Deal price must be a whole number')
      .min(1, 'Deal price must be at least 1'),
  })
  .strict();

export const createDealRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid property ID format'),
  }),
  body: createDealBodySchema,
});


export const updateDealBodySchema = z
  .object({
    buyerId: z
      .string()
      .uuid('Invalid buyer ID format')
      .optional(),
    dealPrice: z
      .number({ message: 'Deal price must be a number' })
      .int('Deal price must be a whole number')
      .min(0, 'Deal price cannot be negative')
      .optional(),
    status: z
      .enum([
        DEAL_STATUS.NEGOTIATION,
        DEAL_STATUS.CLOSED,
        DEAL_STATUS.LOST,
      ])
      .optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.buyerId !== undefined ||
      data.dealPrice !== undefined ||
      data.status !== undefined,
    {
      message: 'At least one field (buyerId, dealPrice, or status) must be provided to update',
    },
  );

export const updateDealRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid deal ID format'),
  }),
  body: updateDealBodySchema,
});


export const dealIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid deal ID format'),
  }),
});

export const propertyIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid property ID format'),
  }),
});


export type CreateDealBodyInput = z.infer<typeof createDealBodySchema>;
export type UpdateDealBodyInput = z.infer<typeof updateDealBodySchema>;