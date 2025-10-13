'use server';

import { RegisterUserType } from '@/shared/schemas/register-user-schema';
import { userRepository } from './user-repository';
import { generateSalt, hashPassword, verifyPassword } from '@/shared/lib/auth';
import { sessionRepository } from './session-repository';
import { TokenService } from './token-service';
import { REFRESH_TOKEN_EXPIRATION_SECONDS } from '@/shared/config';
import { UserRole } from '@prisma/client';

//======================================================================================
//Регистрация пользователя
export async function registerUser(data: RegisterUserType) {
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
}
//======================================================================================

//======================================================================================
//Логин пользователя

export async function loginUser(login: string, password: string) {
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
}
//======================================================================================

//======================================================================================
//logout (по userId token)

export async function logoutUser(userId: number) {
  try {
    await sessionRepository.deleteAllByUserId(userId);
    return true;
  } catch (error) {
    console.error('[AUTH_SERVICE_LOGOUT]', error);
    throw new Error('Ошибка при выходе из аккаунта');
  }
}
//======================================================================================

//======================================================================================
//refresh токенов
export async function refreshTokens(refreshToken: string) {
  const session = await sessionRepository.deleteByRefreshToken(refreshToken);
  if (!session) throw new Error('Неверный refresh токен');

  // Проверяем, не истёк ли refresh-токен
  if (session.expiresAt < new Date()) {
    await sessionRepository.deleteByRefreshToken(refreshToken);
    throw new Error('Срок действия refresh токена истёк');
  }

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
}
//======================================================================================
//получаем пользователя по access токену
export async function getUserFromAccessToken(token: string) {
  const user = await TokenService.getUserFromAccessToken(token);
  if (!user) throw new Error('Пользователь не найден или токен неверный');
  return user;
}
//======================================================================================
