import { refreshTokens } from '@/shared/services/auth/auth-service';

export async function refreshFeature(refreshToken: string) {
  const { user, accessToken, refreshToken: newRefreshToken } = await refreshTokens(refreshToken);
  return { user, accessToken, refreshToken: newRefreshToken };
}
