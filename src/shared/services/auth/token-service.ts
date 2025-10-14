import jwt, { JwtPayload as JwtVerifyPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRole } from '@prisma/client';

import prisma from '@/shared/lib/prisma';
import { JWT_SECRET } from '@/shared/config';
import { AuthUser } from '@/shared/types/auth-user.type';

type JwtPayload = {
  userId: number;
  role: 'USER' | 'ADMIN';
};

if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET is undefined! Убедись, что он задан в .env');
}

export class TokenService {
  //генерация access token
  static generateAccessToken(payload: { userId: number; role: UserRole }) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  }

  //генерация refresh token
  static generateRefreshToken() {
    return crypto.randomBytes(64).toString('hex');
  }

  // Верификация access token
  static verifyAccessToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtVerifyPayload;
      // Проверка типа payload
      if (typeof decoded.userId !== 'number' || !decoded.role) return null;

      return { userId: decoded.userId, role: decoded.role as UserRole };
    } catch (error) {
      console.error('[TokenService.verifyAccessToken]', error);
      return null;
    }
  }

  // Получение пользователя из access token
  static async getUserFromAccessToken(token: string): Promise<AuthUser | null> {
    try {
      const payload = this.verifyAccessToken(token);
      if (!payload) return null;
      const user = await prisma.user.findUnique({
        where: {
          id: payload.userId,
        },
        select: {
          id: true,
          login: true,
          role: true,
          firstName: true,
          lastName: true,
          balance: true,
          subsEnd: true,
          subscription: {
            select: { name: true, dailyPrice: true, maxPeers: true, description: true },
          },
        },
      });

      return user ?? null;
    } catch (error) {
      console.error('[TokenService.getUserFromAccessToken]', error);
      return null;
    }
  }
}
