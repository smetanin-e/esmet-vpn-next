import { SubscriptionFormType } from '@/features/subscription/model/schemas/subcription-schema';
import { prisma } from '@/shared/lib/prisma';

export const subscriptionRepository = {
  async getSubcriptions() {
    return prisma.subscription.findMany();
  },
  async findByName(name: string) {
    return prisma.subscription.findFirst({
      where: { name },
    });
  },
  async createSubscription(formData: SubscriptionFormType) {
    return prisma.subscription.create({
      data: {
        name: formData.name,
        dailyPrice: Number(formData.dailyPrice),
        maxPeers: Number(formData.maxPeers),
        description: formData.description,
        active: true,
      },
    });
  },
};
