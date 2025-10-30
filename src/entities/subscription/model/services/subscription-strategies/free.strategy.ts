import { SubscriptionStrategy } from '../../types/subscription';

export class FreeStrategy implements SubscriptionStrategy {
  async shouldCharge(): Promise<boolean> {
    // Никогда не списываем средства
    return false;
  }

  async calculateAmount(): Promise<number> {
    return 0;
  }

  getDescription(): string {
    return 'Бесплатный тариф';
  }
}
