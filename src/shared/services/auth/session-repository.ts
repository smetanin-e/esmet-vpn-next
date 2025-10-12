//Изолируем всю работу с таблицей session.

import prisma from '@/shared/lib/prisma';

export const sessionRepository = {
  async deleteAllByUserId(userId: number) {
    return prisma.session.deleteMany({ where: { userId } });
  },

  async create(userId: number, refreshToken: string, expiresAt: Date) {
    return prisma.session.create({
      data: { userId, refreshToken, expiresAt },
    });
  },

  async findByRefreshToken(token: string) {
    return prisma.session.findUnique({
      where: { refreshToken: token },
    });
  },

  async deleteByRefreshToken(token: string) {
    return prisma.session.delete({
      where: { refreshToken: token },
    });
  },
};
