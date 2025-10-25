'use server';
import { userRepository } from '@/entities/user/repository/user-repository';
import { peerRepository } from '@/entities/wg-peer/repository/peer-repository';

export const toggleUserStatusAction = async (userId: number) => {
  try {
    const user = await userRepository.findUserById(userId);
    if (!user) return { success: false, message: 'Пользователь не найден' };
    const peers = await peerRepository.findPeersByUserId(userId);
    if (!peers) {
      await userRepository.toggleUserStatus(userId, !user.status);
      return { success: true };
    }

    if (user.status) {
      await peerRepository.deactivatePeersByUserId(userId);
      await userRepository.toggleUserStatus(userId, false);
    } else {
      await userRepository.toggleUserStatus(userId, true);
      await peerRepository.activatePeersByUserId(userId);
    }

    return { success: true };
  } catch (error) {
    console.error('[TOGGLE_STATUS_USER] Server error', error);
    return { success: false, message: 'Ошибка изменения статуса пользователя' };
  }
};
