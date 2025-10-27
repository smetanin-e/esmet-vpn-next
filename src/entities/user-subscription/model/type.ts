import { UserSubscription } from '@prisma/client';

export type UserSubscriptionDTO = UserSubscription & {
  subscriptionPlan: {
    id: number;
    name: string;
    label: string;
    dailyPrice: number;
    maxPeers: number;
    description: string | null;
  };
};
