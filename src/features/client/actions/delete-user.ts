import { userRepository } from '@/entities/user/repository/user-repository';

export const deleteUser = async (userId: number) => {
  try {
    const user = await userRepository.findUserById(userId);
    if (!user) return { success: false, message: 'Пользователь не найден' };
  } catch (error) {
    console.error('[DELETE_USER] Server error', error);
    return { success: false, message: 'Ошибка удаления пользователя' };
  }
};
