
import { z } from 'zod';
import { ENTITY_TYPES } from '../../constants/entityTypes.js';
import { ROLES } from '../../constants/roles.js';

const userSchema = z
  .object({
    entityType: z.literal(ENTITY_TYPES.USER),
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
    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters'),
    role: z.enum([
      ROLES.ADMIN,
      ROLES.AGENT,
      ROLES.COMMISSION_MANAGER,
    ]),
  })
  .strict();

const buyerSchema = z
  .object({
    entityType: z.literal(ENTITY_TYPES.BUYER),
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

export const createUserSchema = z.discriminatedUnion('entityType', [
  userSchema,
  buyerSchema,
]);

export type CreateUserInput = z.infer<typeof createUserSchema>;
