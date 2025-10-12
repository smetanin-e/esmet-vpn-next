import { ACCESS_TOKEN_COOKIE } from '@/shared/config';
import { NextResponse } from 'next/server';

export function setAccessTokenCookie(response: NextResponse, token: string, maxAgesSec: number) {
  response.cookies.set(ACCESS_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict',
    maxAge: maxAgesSec,
  });
}
