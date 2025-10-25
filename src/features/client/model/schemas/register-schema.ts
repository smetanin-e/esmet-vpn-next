import z from 'zod';

import { passwordSchema } from '@/shared/lib/validation';
import { loginSchema } from '@/features/auth/model/schemas/login-schema';

const phoneRegex = /^\+7\d{3}\d{3}\d{2}\d{2}$/;

export const registerUserSchema = z
  .object({
    ...loginSchema.shape,
    subscription: z.string().min(1, { message: 'Нужно выбрать подписку' }).nullable(),
    firstName: z.string().min(1, { message: 'Нужно ввести имя' }),
    lastName: z.string().min(1, { message: 'Нужно ввести фамилию' }),
    phone: z.string().regex(phoneRegex, {
      message: 'Номер телефона должен соответствовать формату +79991234567',
    }),
    confirmPassword: passwordSchema,
    telegram: z.string().min(2, { message: 'Нужно заполнить имя пользователя tg' }),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    {
      message: 'Пароли не совпадают',
      path: ['confirmPassword'],
    },
  );

export type RegisterUserType = z.infer<typeof registerUserSchema>;
