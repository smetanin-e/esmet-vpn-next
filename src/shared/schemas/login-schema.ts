import { z } from 'zod';
import { passwordSchema } from './password-schema';

export const loginSchema = z.object({
  login: z
    .string()
    .min(2, { message: 'Введите логин' })
    .regex(/^[A-Za-z].*$/, { message: 'Логин должен начинаться с латинской буквы' }),
  password: passwordSchema,
});

export type LoginFormType = z.infer<typeof loginSchema>;
