'use server';
import { userSubscriptionRepository } from '@/entities/user-subscription/repository/user-subscription-repository';
import { userRepository } from '@/entities/user/repository/user-repository';
import { peerRepository } from '@/entities/wg-peer/repository/peer-repository';
import { getUserSession } from '@/features/user/actions/get-user-session';

export const deleteUserAction = async (userId: number) => {
  try {
    const authUser = await getUserSession();
    if (!authUser || authUser.id === userId) {
      return { success: false, message: 'Нельзя отключить учетную запись текущего пользователя' };
    }

    const user = await userRepository.findUserById(userId);
    if (!user) return { success: false, message: 'Пользователь не найден' };

    //Удаляем подписку
    const subscription = await userSubscriptionRepository.findByUserId(user.id);
    if (subscription) {
      await userSubscriptionRepository.deleteByUserId(user.id);
    }
    //удаляем пиры
    await peerRepository.deletePeersByUserId(user.id);

    //Удаляем пользователя
    await userRepository.deleteUser(user.id);

    return { success: true };
  } catch (error) {
    console.error('[DELETE_USER] Server error', error);
    return { success: false, message: 'Ошибка удаления пользователя' };
  }
};
