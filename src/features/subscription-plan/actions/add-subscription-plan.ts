'use server';

import { getUserSession } from '@/features/user/actions/get-user-session';
import { SubscriptionPlanFormType } from '../model/schemas/subcription-plan-schema';
import { UserRole } from '@prisma/client';
import { subscriptionPlanRepository } from '@/entities/subscription-plan/repository/subscription-plan-repository';

export const addSubscriptionPlan = async (formData: SubscriptionPlanFormType) => {
  try {
    const admin = await getUserSession();
    if (!admin || !admin.status || admin.role !== UserRole.ADMIN) {
      return { success: false, message: 'У вас нет прав на создание подписок' };
    }

    const findSubscription = await subscriptionPlanRepository.findByName(formData.name);
    if (findSubscription) {
      return { success: false, message: 'Подписка с таким названием уже существует' };
    }
    await subscriptionPlanRepository.createSubscriptionPlan(formData);

    return { success: true };
  } catch (error) {
    console.error('[CREATE_SUBSCRIPTION] Server error', error);
    return { success: false, message: 'Ошибка создания подписки' };
  }
};
