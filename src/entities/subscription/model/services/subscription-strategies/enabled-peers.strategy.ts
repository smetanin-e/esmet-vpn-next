import { SubscriptionChargeContext, SubscriptionStrategy } from '../../types/subscription';

export class EnabledPeersStrategy implements SubscriptionStrategy {
  async shouldCharge(context: SubscriptionChargeContext): Promise<boolean> {
    // Списываем, если есть пиры активные последние 24 часа
    return (context.peersLast24hCount ?? 0) > 0;
  }

  async calculateAmount(context: SubscriptionChargeContext): Promise<number> {
    return context.subscriptionPlan.dailyPrice;
  }

  getDescription(context: SubscriptionChargeContext): string {
    return `Списание за пиры активные последние 24 часа по тарифу "${context.subscriptionPlan.name}"`;
  }
}
