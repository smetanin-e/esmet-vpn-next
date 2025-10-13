import { REFRESH_TOKEN_COOKIE } from '@/shared/config';
import { NextResponse } from 'next/server';

export function removeRefreshTokenCookie(response: NextResponse) {
  response.cookies.set(REFRESH_TOKEN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}
