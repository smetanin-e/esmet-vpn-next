import { z } from 'zod';

export const createPeerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Введите название файла' })
    .regex(/^[A-Za-z].*$/, { message: 'Название должно начинаться с латинской буквы' }),
});

export type CreatePeerType = z.infer<typeof createPeerSchema>;
