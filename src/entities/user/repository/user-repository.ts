import { RegisterUserType } from '@/features/auth/model/schemas/register-schema';
import { prisma } from '@/shared/lib';
import { generateSalt, hashPassword } from '@/shared/lib/auth/password-utils';
import { AuthUserType } from '../model/types';

export const userRepository = {
  async findUserByLogin(login: string) {
    return prisma.user.findUnique({ where: { login } });
  },

  async findAuthUserById(userId: number): Promise<AuthUserType | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        login: true,
        role: true,
        firstName: true,
        status: true,
        lastName: true,
        balance: true,
        subsEnd: true,
        subscription: {
          select: { name: true, dailyPrice: true, maxPeers: true, description: true },
        },
      },
    });

    if (!user) return null;
    return user;
  },

  async registerUser(data: RegisterUserType) {
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);
    return prisma.user.create({
      data: {
        login: data.login,
        password: hashedPassword,
        salt,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        telegram: data.telegram.startsWith('http')
          ? data.telegram
          : `https://t.me/${data.telegram}`,
        subscriptionId: Number(data.subscription) || null,
      },
    });
  },

  async findUserWithRelations(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        transactions: true,
        peers: true,
      },
    });
  },

  async updateUserById(userId: number, data: object) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  },
};
