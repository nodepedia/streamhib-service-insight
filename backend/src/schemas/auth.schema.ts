import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters')
      .trim(),
    email: z.string()
      .email('Invalid email address')
      .max(255, 'Email must be less than 255 characters')
      .trim()
      .toLowerCase(),
    password: z.string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be less than 100 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
  })
});

export const loginSchema = z.object({
  body: z.object({
    identifier: z.string()
      .min(1, 'Email or username is required')
      .trim(),
    password: z.string()
      .min(1, 'Password is required')
  })
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
