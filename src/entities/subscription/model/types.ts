import { Subscription } from '@prisma/client';

export type UserSubscription = {
  name: string;
  dailyPrice: number;
  description: string;
  maxPeers: number;
  active: boolean;
};

export type SubscriptionType = Subscription;
