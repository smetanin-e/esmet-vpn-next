import { REFRESH_TOKEN_COOKIE } from '@/shared/config';
import { NextResponse } from 'next/server';

export function setRefreshTokenCookie(response: NextResponse, token: string, maxAgesSec: number) {
  response.cookies.set(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict',
    maxAge: maxAgesSec,
  });
}
