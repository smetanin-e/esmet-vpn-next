import { Subscription } from '@prisma/client';

export type UserSubscription = {
  name: string;
  dailyPrice: number;
  description: string;
  maxPeers: number;
};

export type SubscriptionType = Subscription;
