import { prisma } from '@/shared/lib/prisma';
import {
  type UserSubscription as PrismaUserSubscription,
  type SubscriptionPlan as PrismaSubscriptionPlan,
  TransactionType,
  OrderStatus,
} from '@prisma/client';

import { ActivePeersStrategy, EnabledPeersStrategy, FreeStrategy } from '../internal';
import { SubscriptionChargeContext, SubscriptionStrategy } from '../types/subscription';
import { WgSyncService } from '@/entities/wg-peer/model/services/wg-sync.service';

export class SubscriptionService {
  private strategies: Map<string, SubscriptionStrategy> = new Map();
  private wgSync = new WgSyncService();

  constructor() {
    this.registerStrategies();
  }

  private registerStrategies(): void {
    this.strategies.set('STANDART', new ActivePeersStrategy());
    this.strategies.set('FLEX', new EnabledPeersStrategy());
    this.strategies.set('FREE', new FreeStrategy());
  }

  /** Основной метод для cron: списываем всем пользователям */
  async chargeAllUsers(): Promise<void> {
    // 1. Обновляем активность пиров
    await this.wgSync.updatePeersActivity();

    // 2. Получаем всех пользователей с активной подпиской
    const subscriptions = await prisma.userSubscription.findMany({
      where: { status: true },
      include: { subscriptionPlan: true },
    });

    for (const sub of subscriptions) {
      await this.chargeUser(sub.userId, sub);
    }
  }

  /**
   * Главный метод — выполняет списание для пользователя.
   *
   * @param userId - id пользователя
   * @param userSubscription - опционально: уже загруженный объект UserSubscription с relation subscriptionPlan
   */
  async chargeUser(
    userId: number,
    userSubscription?: PrismaUserSubscription & { subscriptionPlan: PrismaSubscriptionPlan },
  ): Promise<boolean> {
    if (!userSubscription) {
      const sub = await prisma.userSubscription.findFirst({
        where: { userId },
        include: { subscriptionPlan: true },
      });
      if (!sub || !sub.status) {
        console.log(`No active subscription for user ${userId}`);
        return false;
      }
      userSubscription = sub;
    }

    const subscriptionPlan = userSubscription.subscriptionPlan;

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Считаем пиры
    const peersLast24hCount = await prisma.wireguardPeer.count({
      where: { userId, lastActivity: { gte: twentyFourHoursAgo } },
    });
    const activePeersCount = await prisma.wireguardPeer.count({
      where: { userId, status: 'ACTIVE' },
    });

    const maxPeers = subscriptionPlan.maxPeers;

    const context: SubscriptionChargeContext = {
      userId,
      userSubscription,
      subscriptionPlan,
      currentDate: new Date(),
      peersLast24hCount,
      activePeersCount,
      maxPeers,
    };

    const strategy = this.selectStrategy(subscriptionPlan);

    const shouldCharge = await strategy.shouldCharge(context);
    if (!shouldCharge) {
      console.log(`No charge needed for user ${userId}`);
      return false;
    }

    const amount = await strategy.calculateAmount(context);
    if (amount === 0) {
      console.log(`Zero amount for user ${userId}`);
      return false;
    }

    const description = strategy.getDescription(context);

    console.log(`Charging user ${userId}: ${amount} rub - ${description}`);
    return this.processCharge(userId, amount, description);
  }

  private selectStrategy(subscriptionPlan: PrismaSubscriptionPlan): SubscriptionStrategy {
    // Определяем стратегию по типу подписки
    const planLabel = subscriptionPlan.label.toUpperCase();

    if (planLabel.includes('FREE') || subscriptionPlan.dailyPrice === 0) {
      return this.strategies.get('FREE')!;
    }

    if (planLabel.includes('STANDART')) {
      return this.strategies.get('STANDART')!;
    }

    // По умолчанию стратегия для одного пира
    return this.strategies.get('FLEX')!;
  }

  /**
   * Реальная логика записи транзакции и обновления баланса.
   * Всё в одной транзакции Prisma для консистентности.
   */

  private async processCharge(
    userId: number,
    amount: number,
    description: string,
  ): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        // 1) Создаём запись транзакции
        await tx.transaction.create({
          data: {
            userId,
            amount,
            description,
            type: TransactionType.CHARGE,
            status: OrderStatus.SUCCEEDED,
          },
        });

        // 2) Обновляем баланс пользователя (понижаем)
        await tx.user.update({
          where: { id: userId },
          data: { balance: { decrement: amount } },
        });

        // (Опционально) 3) Если баланс ушёл в минус — можно дизейблить пиры или генерировать события.
        // const updatedUser = await tx.user.findUnique({ where: { id: userId }, select: { balance: true } });
        // if (updatedUser && updatedUser.balance < 0) { ... }
      });

      console.log(`Charge processed: user ${userId}, amount ${amount}`);
      return true;
    } catch (error) {
      console.error('processCharge error', error);
      return false;
    }
  }
}
