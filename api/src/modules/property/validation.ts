import { z } from 'zod';

export const createPropertySchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Title must contain at least 2 characters')
      .max(200, 'Title cannot exceed 200 characters'),
    address: z
      .string()
      .trim()
      .min(5, 'Address must contain at least 5 characters')
      .max(500, 'Address cannot exceed 500 characters'),
    basePrice: z
      .number({ message: 'Base price must be a number' })
      .int('Base price must be a whole number')
      .min(1, 'Base price must be at least 1'),
  })
  .strict();


export const updatePropertyBodySchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, 'Title must contain at least 2 characters')
      .max(200, 'Title cannot exceed 200 characters')
      .optional(),
    address: z
      .string()
      .trim()
      .min(5, 'Address must contain at least 5 characters')
      .max(500, 'Address cannot exceed 500 characters')
      .optional(),
    basePrice: z
      .number({ message: 'Base price must be a number' })
      .int('Base price must be a whole number')
      .min(1, 'Base price must be at least 1')
      .optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.title !== undefined ||
      data.address !== undefined ||
      data.basePrice !== undefined,
    {
      message: 'At least one field (title, address, or basePrice) must be provided to update',
    },
  );

export const updatePropertyRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid property ID format'),
  }),
  body: updatePropertyBodySchema,
});


export const propertyIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid property ID format'),
  }),
});

export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type UpdatePropertyInput = z.infer<typeof updatePropertyBodySchema>;