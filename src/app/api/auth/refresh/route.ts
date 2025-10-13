import { refreshFeature } from '@/features/auth/refresh';
import {
  ACCESS_TOKEN_EXPIRATION_SECONDS,
  REFRESH_TOKEN_COOKIE,
  REFRESH_TOKEN_EXPIRATION_SECONDS,
} from '@/shared/config';
import { setAccessTokenCookie, setRefreshTokenCookie } from '@/shared/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'refresh токен отсутствует' }, { status: 401 });
    }

    const { user, accessToken, refreshToken: newRefreshToken } = await refreshFeature(refreshToken);

    const response = NextResponse.json({
      user,
      accessToken,
      success: true,
    });

    setAccessTokenCookie(response, accessToken, ACCESS_TOKEN_EXPIRATION_SECONDS);
    setRefreshTokenCookie(response, newRefreshToken, REFRESH_TOKEN_EXPIRATION_SECONDS);

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('[API_AUTH_REFRESH]', error);
    const message = error instanceof Error ? error.message : 'Ошибка при обновлении токена';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
