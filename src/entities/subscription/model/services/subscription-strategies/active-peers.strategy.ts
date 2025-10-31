import { SubscriptionChargeContext, SubscriptionStrategy } from '../../types/subscription';

export class ActivePeersStrategy implements SubscriptionStrategy {
  async shouldCharge(context: SubscriptionChargeContext): Promise<boolean> {
    console.log(`peersLast24hCount`, context.peersLast24hCount);
    return (context.peersLast24hCount ?? 0) > 0 || (context.activePeersCount ?? 0) > 0;
  }

  async calculateAmount(context: SubscriptionChargeContext): Promise<number> {
    const unitsCount = Math.max(context.peersLast24hCount ?? 0, context.activePeersCount ?? 0);
    if (unitsCount === 0) return 0;
    return this.calculatePrice(
      context.subscriptionPlan.dailyPrice,
      unitsCount,
      context.subscriptionPlan.maxPeers,
    );
  }

  getDescription(context: SubscriptionChargeContext): string {
    return `Списание за активные пиры (последние 24ч или статус ACTIVE) по тарифу "${context.subscriptionPlan.name}"`;
  }

  private calculatePrice(totalAmount: number, unitsCount: number, maxPeers: number): number {
    if (maxPeers <= 0) return 0;
    if (unitsCount <= 0) return 0;
    if (unitsCount > maxPeers) unitsCount = maxPeers;

    // Формируем коэффициенты убывания ценности
    const ratios: number[] = [];
    for (let i = 0; i < maxPeers; i++) {
      const ratio = 1 - (i / (maxPeers - 1)) * 0.6; // убывает на 60% от первого к последнему
      ratios.push(ratio);
    }

    // Нормализуем коэффициенты под totalAmount
    const sumRatios = ratios.reduce((sum, r) => sum + r, 0);
    const prices = ratios.map((r) => Math.round((r / sumRatios) * totalAmount));

    // Корректируем из-за округления
    let diff = totalAmount - prices.reduce((s, p) => s + p, 0);
    let i = 0;
    while (diff !== 0) {
      prices[i % prices.length] += diff > 0 ? 1 : -1;
      diff += diff > 0 ? -1 : 1;
      i++;
    }

    // Кумулятивная сумма
    const cumulative = prices.reduce<number[]>((acc, p, i) => {
      acc.push((acc[i - 1] ?? 0) + p);
      return acc;
    }, []);

    // Возвращаем накопленную цену для unitsCount
    return cumulative[unitsCount - 1];
  }
}
