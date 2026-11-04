import { z } from 'zod';

export const createBuyerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must contain at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address'),
  })
  .strict();

export const updateBuyerBodySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, 'Name must contain at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .optional(),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Please enter a valid email address')
      .optional(),
  })
  .strict()
  .refine(
    (data) => data.name !== undefined || data.email !== undefined,
    {
      message: 'At least one field (name or email) must be provided to update',
    },
  );

export const updateBuyerRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid buyer ID format'),
  }),
  body: updateBuyerBodySchema,
});

export const buyerIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid buyer ID format'),
  }),
});

export type CreateBuyerInput = z.infer<typeof createBuyerSchema>;
export type UpdateBuyerInput = z.infer<typeof updateBuyerBodySchema>;