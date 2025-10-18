'use server';
import { UserRole } from '@prisma/client';
import { RegisterUserType } from '../schemas/register-schema';
import { getUserSession } from './get-user-session';
import { prisma } from '@/shared/lib';
import { generateSalt, hashPassword } from '@/shared/lib/auth/password-utils';

export const registerUser = async (formData: RegisterUserType) => {
  try {
    const admin = await getUserSession();
    if (!admin || !admin.status || admin.role !== UserRole.ADMIN) {
      throw new Error('У вас нет прав на создание пользователя');
    }

    const findUser = await prisma.user.findUnique({
      where: { login: formData.login },
    });

    if (findUser) {
      throw new Error('Пользователь с таким логином уже существует');
    }

    //TODO Добавить позже
    // const subscription = await prisma.subscription.findFirst({
    //   where: { id: Number(data.subscription) },
    // });

    // if (!subscription) {
    //   throw new Error('Подписка не найдена');
    // }
    const salt = generateSalt();
    const hashedPassword = await hashPassword(formData.password, salt);

    return prisma.user.create({
      data: {
        login: formData.login,
        password: hashedPassword,
        salt: salt,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        telegram: formData.telegram.startsWith('http')
          ? formData.telegram
          : `https://t.me/${formData.telegram}`,
        //subscriptionId: Number(formData.subscription),
      },
    });
  } catch (error) {
    console.error('[REGISTER_USER] Server error', error);
    throw error;
  }
};
