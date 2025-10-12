import z from 'zod';
import { loginSchema } from './login-schema';
import { passwordSchema } from './password-schema';

const phoneRegex = /^\+7\d{3}\d{3}\d{2}\d{2}$/;

export const registerUserSchema = z
  .object({
    ...loginSchema.shape,
    subscription: z.string().min(1, { message: 'Нужно выбрать подписку' }),
    firstName: z.string().min(2, { message: 'Имя должно содержать минимум 2 символа' }),
    lastName: z.string().min(2, { message: 'Фамилия должна содержать минимум 2 символа' }),
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
