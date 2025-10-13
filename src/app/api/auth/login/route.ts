import { loginFeature } from '@/features/auth/login';
import { ACCESS_TOKEN_EXPIRATION_SECONDS, REFRESH_TOKEN_EXPIRATION_SECONDS } from '@/shared/config';
import { setAccessTokenCookie, setRefreshTokenCookie } from '@/shared/lib/auth';
import { loginSchema } from '@/shared/schemas/login-schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Невалидные данные' }, { status: 400 });
    }

    const { login, password } = parsed.data;
    const { accessToken, refreshToken } = await loginFeature(login, password);

    const response = NextResponse.json({ accessToken });
    setRefreshTokenCookie(response, refreshToken, REFRESH_TOKEN_EXPIRATION_SECONDS);
    setAccessTokenCookie(response, accessToken, ACCESS_TOKEN_EXPIRATION_SECONDS);

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error('[API_AUTH_LOGIN]Ошибка входа в аккаунт', error);
    const message = error instanceof Error ? error.message : 'Ошибка входа в аккаунт';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
