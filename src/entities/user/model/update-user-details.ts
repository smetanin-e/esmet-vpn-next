import { WgPeerStatus } from '@prisma/client';
import { userRepository } from '../repository/user-repository';
import { userSubscriptionRepository } from '@/entities/user-subscription/repository/user-subscription-repository';

export const updateUserDetails = async (userId: number) => {
  const user = await userRepository.findUserById(userId);

  if (!user || !user.userSubscription) return;

  const activePeersCount = user.peers
    ? user.peers.filter((peer) => peer.status === WgPeerStatus.ACTIVE).length
    : 0;
  const balance = user.balance;
  const userDailyPrice = user.userSubscription.subscriptionPlan.dailyPrice;

  const dailyPrice = userDailyPrice ? userDailyPrice : 0;
  const dailyCost = (dailyPrice as number) * activePeersCount;

  let endDate: Date | null = null;

  if (dailyCost > 0) {
    const daysLeft = Math.floor(balance / dailyCost);
    if (daysLeft > 0) {
      const newEndDate = new Date();
      newEndDate.setDate(newEndDate.getDate() + daysLeft);
      endDate = newEndDate;
    }
  }
  await userSubscriptionRepository.updateById(user.userSubscription.id, { endDate: endDate });
};
