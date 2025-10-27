import z from 'zod';

export const subscriptionPlanSchema = z.object({
  name: z.string().min(1, { message: 'Введите название подписки' }),
  label: z.string().min(1, { message: 'Введите метку подписки' }),
  description: z.string().min(5, { message: 'Введите описание' }),
  dailyPrice: z.string().regex(/^[0-9][0-9]*$/, {
    message: 'Введите корректные данные',
  }),
  maxPeers: z.string().regex(/^[1-9][0-9]*$/, {
    message: 'Введите корректные данные',
  }),
});
export type SubscriptionPlanFormType = z.infer<typeof subscriptionPlanSchema>;
