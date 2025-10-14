import { axiosInstance } from '@/shared/services/instance';
import { AuthUser } from '@/shared/types/auth-user.type';

export async function getMeClient(): Promise<AuthUser | null> {
  try {
    const res = await axiosInstance.get<AuthUser>('auth/me', {
      withCredentials: true,
    });

    if (res.status === 401) {
      return null;
    }

    if (!res.data) {
      throw new Error('Ошибка при получении пользователя (client)');
    }

    return res.data;
  } catch {
    return null;
  }
}
