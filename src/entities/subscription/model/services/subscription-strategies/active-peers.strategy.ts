import { SubscriptionChargeContext, SubscriptionStrategy } from '../../types/subscription';

export class ActivePeersStrategy implements SubscriptionStrategy {
  async shouldCharge(context: SubscriptionChargeContext): Promise<boolean> {
    return (context.peersLast24hCount ?? 0) > 0 || (context.activePeersCount ?? 0) > 0;
  }

  async calculateAmount(context: SubscriptionChargeContext): Promise<number> {
    const unitsCount = Math.max(context.peersLast24hCount ?? 0, context.activePeersCount ?? 0);
    if (unitsCount === 0) return 0;
    return this.calculatePrice(context.subscriptionPlan.dailyPrice, unitsCount);
  }

  getDescription(context: SubscriptionChargeContext): string {
    return `Списание за активные пиры (последние 24ч или статус ACTIVE) по тарифу "${context.subscriptionPlan.name}"`;
  }

  private calculatePrice(totalAmount: number, unitsCount: number): number {
    if (unitsCount <= 0) return 0;
    if (unitsCount === 1) return totalAmount;

    const ratios: number[] = [];
    for (let i = 0; i < unitsCount; i++) {
      const ratio = 1 - (i / (unitsCount - 1)) * 0.6;
      ratios.push(ratio);
    }

    const sumRatios = ratios.reduce((sum, r) => sum + r, 0);
    const prices = ratios.map((r) => Math.round((r / sumRatios) * totalAmount));

    let difference = totalAmount - prices.reduce((sum, p) => sum + p, 0);
    if (difference !== 0) {
      const sortedIndices = prices.map((_, i) => i).sort((a, b) => prices[b] - prices[a]);
      let index = 0;
      while (difference !== 0) {
        const adjust = difference > 0 ? 1 : -1;
        prices[sortedIndices[index]] += adjust;
        difference -= adjust;
        index = (index + 1) % sortedIndices.length;
      }
    }

    let result = 0;
    return prices.map((p) => (result += p))[prices.length - 1];
  }
}
