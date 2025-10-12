'use server';

import { RegisterUserType } from '@/shared/schemas/register-user-schema';
import { userRepository } from './user-repository';
import { generateSalt, hashPassword, verifyPassword } from '@/shared/lib/auth';
import { sessionRepository } from './session-repository';
import { TokenService } from './token-service';
import { REFRESH_TOKEN_EXPIRATION_SECONDS } from '@/shared/config';
import { UserRole } from '@prisma/client';

export const authService = {
  //======================================================================================
  //Регистрация пользователя
  async registerUser(data: RegisterUserType) {
    const existingUser = await userRepository.findByLogin(data.login);
    if (existingUser) throw new Error('Пользователь с таким логином уже существует');

    //Генерируем соль и хэшируем пароль
    const salt = generateSalt();
    const hashedPassword = await hashPassword(data.password, salt);

    // Создаём пользователя через репозиторий
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
      salt,
    });

    // Возвращаем безопасного пользователя (без пароля и соли)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, salt: __, ...safeUser } = user;
    return safeUser;
  },
  //======================================================================================

  //======================================================================================
  //Логин пользователя

  async loginUser(login: string, password: string) {
    //Ищем пользователя
    const user = await userRepository.findByLogin(login);
    if (!user) throw new Error('Неверный логин или пароль');

    // Проверяем пароль
    const isValid = await verifyPassword(password, user.password, user.salt!);
    if (!isValid) throw new Error('Неверный логин или пароль');

    // Удаляем все старые сессии
    await sessionRepository.deleteAllByUserId(user.id);

    // Генерируем новый refresh token
    const refreshToken = TokenService.generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_SECONDS * 1000);

    // Сохраняем сессию
    await sessionRepository.create(user.id, refreshToken, expiresAt);

    // Генерируем access token
    const accessToken = TokenService.generateAccessToken({
      userId: user.id,
      role: user.role as UserRole,
    });

    // Возвращаем безопасного пользователя и токены
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, salt: __, ...safeUser } = user;
    return { user: safeUser, accessToken, refreshToken };
  },
  //======================================================================================

  //======================================================================================
  //logout (по refresh token)

  async logoutUser(refreshToken: string) {
    await sessionRepository.deleteByRefreshToken(refreshToken);
    return { success: true };
  },
  //======================================================================================

  //======================================================================================
  //refresh токенов
  async refreshTokens(refreshToken: string) {
    const session = await sessionRepository.deleteByRefreshToken(refreshToken);
    if (!session) throw new Error('Неверный refresh токен');

    const user = await userRepository.findById(session.userId);
    if (!user) throw new Error('Пользователь не найден');

    //генерируем новые токены
    const newAccessToken = TokenService.generateAccessToken({
      userId: user.id,
      role: user.role as UserRole,
    });
    const newRefreshToken = TokenService.generateRefreshToken();
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRATION_SECONDS * 1000);

    //Обновляем сессию
    await sessionRepository.deleteByRefreshToken(refreshToken);
    await sessionRepository.create(user.id, newRefreshToken, expiresAt);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, salt: __, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },
  //======================================================================================
};

// import { generateSalt, hashPassword, verifyPassword } from '@/shared/lib/auth/passwordHasher';

// import prisma from '@/shared/lib/prisma';

// import { REFRESH_TOKEN_EXPIRATION_SECONDS } from '@/shared/config';
// import { generateRefreshToken } from './token-service';
// import { RegisterUserType } from '@/shared/schemas/register-user-schema';

// export async function registerUser(data: RegisterUserType) {
//   try {
//     const salt = generateSalt();
//     const hashedPassword = await hashPassword(data.password, salt);

//     const findUser = await prisma.user.findFirst({
//       where: {
//         login: data.login,
//       },
//     });

//     if (findUser) {
//       throw new Error('Пользователь с таким логином уже существует');
//     }

//     const subscription = await prisma.subscription.findUnique({
//       where: { id: Number(data.subscription) },
//     });

//     if (!subscription) {
//       throw new Error('Подписка не найдена');
//     }

//     const user = await prisma.user.create({
//       data: {
//         login: data.login,
//         password: hashedPassword,
//         salt,
//         firstName: data.firstName,
//         lastName: data.lastName,
//         phone: data.phone,
//         telegram: data.telegram.startsWith('http')
//           ? data.telegram
//           : `https://t.me/${data.telegram}`,
//         subscriptionId: subscription.id,
//       },
//     });
//     //исключаем пароль и соль когда возвращаем user
//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const { password: _, salt: __, ...safeUser } = user;
//     return safeUser;
//   } catch (error) {
//     console.log('Error [REGISTER_USER]', error);
//     throw error;
//   }
// }

// export async function loginUser(login: string, password: string) {
//   const user = await prisma.user.findUnique({
//     where: { login },
//   });

//   if (!user) {
//     throw new Error('Неверный логин или пароль'); //'Пользователь не найден'
//   }
//   const isValidPassword = await verifyPassword(password, user.password, user.salt!);

//   if (!isValidPassword) {
//     throw new Error('Неверный логин или пароль'); //'Неверный пароль'
//   }

//   // Удаляем старые сессии
//   await prisma.session.deleteMany({
//     where: {
//       userId: user.id,
//     },
//   });

//   const refreshToken = generateRefreshToken();
//   const expiresAt = new Date(Date.now() + 1000 * REFRESH_TOKEN_EXPIRATION_SECONDS);

//   await prisma.session.create({
//     data: {
//       userId: user.id,
//       refreshToken,
//       expiresAt,
//     },
//   });

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password: _, salt: __, ...safeUser } = user;
//   return { user: safeUser, refreshToken };
// }
