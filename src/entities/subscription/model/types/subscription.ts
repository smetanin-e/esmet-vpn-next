import type {
  UserSubscription as PrismaUserSubscription,
  SubscriptionPlan as PrismaSubscriptionPlan,
} from '@prisma/client';

/**
 * Контекст, который передаётся стратегиям при расчёте списаний.
 * userSubscription включает связанный subscriptionPlan (чтобы не делать лишних запросов).
 */

export interface SubscriptionChargeContext {
  userId: number;
  userSubscription: PrismaUserSubscription & { subscriptionPlan: PrismaSubscriptionPlan };
  subscriptionPlan: PrismaSubscriptionPlan;
  currentDate: Date;

  // Подсчитанные заранее данные
  peersLast24hCount: number; // пиры, активные последние 24 часа
  activePeersCount: number; // пиры со статусом ACTIVE
  maxPeers: number;
}

/**
 * Интерфейс стратегии.
 * Все методы асинхронные и получают SubscriptionChargeContext.
 */

export interface SubscriptionStrategy {
  shouldCharge(context: SubscriptionChargeContext): Promise<boolean>;
  calculateAmount(context: SubscriptionChargeContext): Promise<number>;
  getDescription(context: SubscriptionChargeContext): string;
}
