import { z } from 'zod';
import { adminLogin as baseSchema } from './AuthSchema';

export const loginSchema = baseSchema;

export const signUpSchema = baseSchema
  .extend({
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
