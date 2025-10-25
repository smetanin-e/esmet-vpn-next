'use server';
import { UserRole } from '@prisma/client';

import { RegisterUserType } from '../model/schemas/register-schema';
import { userRepository } from '@/entities/user/repository/user-repository';
import { subscriptionRepository } from '@/entities/subscription/repository/subscription-repository';
import { getUserSession } from '@/features/user/actions/get-user-session';

export const registerUser = async (formData: RegisterUserType) => {
  try {
    const admin = await getUserSession();
    if (!admin || !admin.status || admin.role !== UserRole.ADMIN) {
      return { success: false, message: 'У вас нет прав на создание пользователя' };
    }

    const findUser = await userRepository.findUserByLogin(formData.login);
    if (findUser) {
      return { success: false, message: 'Пользователь с таким логином уже существует' };
    }

    const subscription = await subscriptionRepository.getSubcriptions();

    if (!subscription) {
      return { success: false, message: 'Подписка не найдена' };
    }

    await userRepository.registerUser(formData);

    return { success: true };
  } catch (error) {
    console.error('[REGISTER_USER] Server error', error);
    return { success: false, message: 'Ошибка регистрации пользователя' };
  }
};
