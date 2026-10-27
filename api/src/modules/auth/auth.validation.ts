import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email('please give correct email adress'),

  password: z
    .string()
    .min(1, 'password is required')
}).strict();

export type loginInput = z.infer<typeof loginSchema>;