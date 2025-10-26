import { prisma } from '@/shared/lib/prisma';

export const userSubscriptionRepository = {
  async findById(id: number) {
    return prisma.userSubscription.findFirst({
      where: { id },
    });
  },
  async createUserSubscription(userId: number, planId: number) {
    return prisma.userSubscription.create({
      data: {
        userId,
        subscriptionPlanId: planId,
      },
    });
  },
  async updateById(id: number, data: object) {
    return prisma.userSubscription.update({
      where: { id },
      data,
    });
  },
};
