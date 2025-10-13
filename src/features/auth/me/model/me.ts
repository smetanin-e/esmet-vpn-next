import { getUserFromAccessToken } from '@/shared/services/auth/auth-service';

export async function meFeatures(accessToken: string) {
  //делегируем проверку и получение пользователя TokenService через authService
  const user = await getUserFromAccessToken(accessToken);
  return { user };
}
