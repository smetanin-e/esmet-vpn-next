import prisma from '@/shared/lib/prisma';
import { RegisterUserType } from '@/shared/schemas/register-user-schema';

export const userRepository = {
  async findByLogin(login: string) {
    return prisma.user.findUnique({ where: { login } });
  },
  async findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  },
  async create(data: RegisterUserType & { password: string; salt: string }) {
    return prisma.user.create({
      data: {
        login: data.login,
        password: data.password,
        salt: data.salt,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        telegram: data.telegram.startsWith('http')
          ? data.telegram
          : `https://t.me/${data.telegram}`,
        subscriptionId: Number(data.subscription),
      },
    });
  },
};
