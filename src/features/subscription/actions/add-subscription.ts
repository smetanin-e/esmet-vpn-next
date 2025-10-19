'use server';

import { getUserSession } from '@/features/user/actions/get-user-session';
import { SubscriptionFormType } from '../model/schemas/subcription-schema';
import { UserRole } from '@prisma/client';
import { subscriptionRepository } from '@/entities/subscription/repository/subscription-repository';

export const addSubscription = async (formData: SubscriptionFormType) => {
  try {
    const admin = await getUserSession();
    if (!admin || !admin.status || admin.role !== UserRole.ADMIN) {
      return { success: false, message: 'У вас нет прав на создание подписок' };
    }

    const findSubscription = await subscriptionRepository.findByName(formData.name);
    if (findSubscription) {
      return { success: false, message: 'Подписка с таким названием уже существует' };
    }
    await subscriptionRepository.createSubscription(formData);

    return { success: true };
  } catch (error) {
    console.error('[CREATE_SUBSCRIPTION] Server error', error);
    return { success: false, message: 'Ошибка создания подписки' };
  }
};
