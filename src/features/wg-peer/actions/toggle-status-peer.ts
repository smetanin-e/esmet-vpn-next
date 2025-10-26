'use server';
import { userRepository } from '@/entities/user/repository/user-repository';
import { peerApi } from '@/entities/wg-peer/api/peer.api';
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

    const subscription = user.userSubscription;
    if (!subscription || !subscription.status) {
      return { success: false, message: 'Запрет на изменение статуса. Подписка отключена' };
    }

    if (peer.status === WgPeerStatus.ACTIVE) {
      await peerRepository.deactivatePeer(data.peerId);
      await peerRepository.updateLabelPeerStatus(data.peerId, false);
    } else {
      await peerRepository.activatePeer(data.peerId);
      await peerRepository.updateLabelPeerStatus(data.peerId, true);
    }

    //await updateUserDetails(user.id);

    return { success: true };
  } catch (error) {
    console.error('[TOGGLE_STATUS_PEER] Server error', error);
    return { success: false, message: 'Ошибка изменения статуса' };
  }
}
