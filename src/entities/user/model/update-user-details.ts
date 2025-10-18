import { prisma } from '@/shared/lib';
import { WgPeerStatus } from '@prisma/client';
import { userRepository } from '../repository/user-repository';

export const updateUserDetails = async (userId: number) => {
  const user = await userRepository.findUserWithRelations(userId);

  if (!user) return;

  const activePeersCount = user.peers.filter((peer) => peer.status === WgPeerStatus.ACTIVE).length;
  const balance = user.balance;
  const dailyPrice = user.subscription?.dailyPrice ? user.subscription?.dailyPrice : 0;
  const dailyCost = (dailyPrice as number) * activePeersCount;

  let subsEnd: Date | null = null;

  if (dailyCost > 0) {
    const daysLeft = Math.floor(balance / dailyCost);
    if (daysLeft > 0) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysLeft);
      subsEnd = endDate;
    }
  }

  await userRepository.updateUserById(userId, { subsEnd });
};
