'use server';
import { userRepository } from '@/entities/user/repository/user-repository';
import { peerRepository } from '@/entities/wg-peer/repository/peer-repository';
import { WgPeerStatus } from '@prisma/client';

type TogglePeerData = {
  peerId: number;
  userId: number;
};

export async function togglePeerStatusAction(data: TogglePeerData) {
  try {
    const user = await userRepository.findUserById(data.userId);
    if (!user || !user.status) {
      return { success: false, message: 'Пользователь не найден или заблокирован' };
    }

    const peer = await peerRepository.findPeerById(data.peerId);
    if (!peer) {
      return { success: false, message: 'Конфигурация не найдена' };
    }

    if (peer.status === WgPeerStatus.ACTIVE) {
      await peerRepository.deactivatePeer(data.peerId);
    } else {
      await peerRepository.activatePeer(data.peerId);
    }

    return { success: true };
  } catch (error) {
    console.error('[DEACTIVATE_PEER] Server error', error);
    return { success: false, message: 'Ошибка деактивации пира' };
  }
}
