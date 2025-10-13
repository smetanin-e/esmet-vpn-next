import { logoutFeature } from '@/features/auth/logout';
import { ACCESS_TOKEN_COOKIE } from '@/shared/config';
import { removeAccessTokenCookie, removeRefreshTokenCookie } from '@/shared/lib/auth';
import { TokenService } from '@/shared/services/auth/token-service';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'access токен не найден' }, { status: 401 });
    }

    const user = await TokenService.getUserFromAccessToken(accessToken);
    if (!user) {
      return NextResponse.json({ error: 'Пользователь не найден' }, { status: 401 });
    }

    await logoutFeature(user.id);

    const response = NextResponse.json({ success: true });
    removeAccessTokenCookie(response);
    removeRefreshTokenCookie(response);

    return response;
  } catch (error) {
    console.error('[API_AUTH_LOGOUT]Ошибка выхода из аккаунта', error);
    const message = error instanceof Error ? error.message : 'Ошибка выхода из аккаунта';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
