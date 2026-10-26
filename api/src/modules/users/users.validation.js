
import { z } from 'zod';

const creatableUserRoleSchema = z.enum([
  'Agent',
  'CommissionManager',
]);

export const createUserSchema = z
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

    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters'),

    role: creatableUserRoleSchema,
  })
  .strict();
