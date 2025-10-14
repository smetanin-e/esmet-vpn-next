import { refreshTokens } from '@/shared/services/auth/auth-service';

export async function refreshFeatureServer(refreshToken: string) {
  const { user, accessToken, refreshToken: newRefreshToken } = await refreshTokens(refreshToken);
  return { user, accessToken, refreshToken: newRefreshToken };
}
