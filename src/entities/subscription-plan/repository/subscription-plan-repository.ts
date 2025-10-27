import { SubscriptionPlanFormType } from '@/features/subscription-plan/model/schemas/subcription-plan-schema';
import { prisma } from '@/shared/lib/prisma';

export const subscriptionPlanRepository = {
  async getPlans() {
    return prisma.subscriptionPlan.findMany();
  },
  async findByName(name: string) {
    return prisma.subscriptionPlan.findFirst({
      where: { name },
    });
  },

  async find(name: string, label: string) {
    return prisma.subscriptionPlan.findFirst({
      where: { OR: [{ name }, { label }] },
    });
  },

  async createSubscriptionPlan(formData: SubscriptionPlanFormType) {
    return prisma.subscriptionPlan.create({
      data: {
        name: formData.name,
        label: formData.label.toUpperCase(),
        dailyPrice: Number(formData.dailyPrice),
        maxPeers: Number(formData.maxPeers),
        description: formData.description,
      },
    });
  },
};
