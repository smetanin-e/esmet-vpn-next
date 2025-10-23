import { RegisterUserType } from '@/features/user/model/schemas/register-schema';
import { prisma } from '@/shared/lib/prisma';
import { generateSalt, hashPassword } from '@/shared/lib/auth/password-utils';
import { UserDTO } from '../model/types';

export const userRepository = {
  async findUserByLogin(login: string) {
    return prisma.user.findUnique({ where: { login } });
  },
  //TODO ИСПРАВИТЬ ТАК КАК АВТОРИЗОВАННЫЙ ПОЛЬЗОВАТЕЛЬ ДОЛЖЕН ИМЕТЬ ПОДПИСКИ ПИРЫ И ТРАНЗАКЦИИ
  async findUserById(userId: number): Promise<UserDTO | null> {
    const user = await prisma.user.findFirst({
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
        telegram: true,
        subscription: {
          select: { name: true, dailyPrice: true, maxPeers: true, description: true, active: true },
        },
        peers: {
          select: { peerName: true, status: true },
          orderBy: { peerName: 'asc' },
        },
        transactions: {
          select: { type: true, description: true, status: true, createdAt: true, amount: true },
          orderBy: { createdAt: 'desc' },
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

  async findAllUsersWithRelations(): Promise<UserDTO[] | null> {
    return await prisma.user.findMany({
      select: {
        id: true,
        login: true,
        role: true,
        firstName: true,
        status: true,
        lastName: true,
        balance: true,
        subsEnd: true,
        telegram: true,
        subscription: {
          select: { name: true, dailyPrice: true, maxPeers: true, description: true, active: true },
        },
        peers: {
          select: { peerName: true, status: true },
          orderBy: { peerName: 'asc' },
        },
        transactions: {
          select: { type: true, description: true, status: true, createdAt: true, amount: true },
          orderBy: { createdAt: 'desc' },
        },
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
