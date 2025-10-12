import prisma from '@/shared/lib/prisma';
import { WgPeerStatus } from '@prisma/client';

export const updateUserDetails = async (userId: number) => {
  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: { subscription: true, peers: true },
  });

  if (!user) return;

  const activePeersCount = user.peers.filter((peer) => peer.status === WgPeerStatus.ACTIVE).length;
  const balance = user.balance;
  const dailyPrice = user.subscription?.dailyPrice ? user.subscription?.dailyPrice : 0;
  const dailyCost = (dailyPrice as number) * activePeersCount; // удалить as number после prisma push

  let subsEnd: Date | null = null;

  if (dailyCost > 0) {
    const daysLeft = Math.floor(balance / dailyCost);
    if (daysLeft > 0) {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysLeft);
      subsEnd = endDate;
    }
  }

  await prisma.user.update({
    where: { id: userId },
    data: { subsEnd },
  });
};
