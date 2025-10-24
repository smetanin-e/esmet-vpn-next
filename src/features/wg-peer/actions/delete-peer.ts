'use server';

import { peerRepository } from '@/entities/wg-peer/repository/peer-repository';

export async function deletePeerAction(peerId: number) {
  try {
    const peer = await peerRepository.findPeerById(peerId);
    if (!peer) {
      return { success: false, message: 'Конфигурация не найдена' };
    }

    await peerRepository.deletePeer(peerId);

    return { success: true };
  } catch (error) {
    console.error('[DELETE_PEER] Server error', error);
    return { success: false, message: 'Ошибка удаления пира' };
  }
}
