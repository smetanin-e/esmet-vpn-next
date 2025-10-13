import { meFeatures } from '@/features/auth/me';
import { ACCESS_TOKEN_COOKIE } from '@/shared/config';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
    if (!accessToken) {
      return NextResponse.json({ error: 'Access токен не найден' }, { status: 401 });
    }

    const { user } = await meFeatures(accessToken);
    return NextResponse.json({ user });
  } catch (error) {
    console.error('[API_AUTH_ME]', error);
    const message = error instanceof Error ? error.message : 'Ошибка при получении пользователя';
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
