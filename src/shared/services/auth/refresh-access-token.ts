import axios from 'axios';
import { axiosInstance } from '../instance';

type User = {
  id: number;
  login: string;
  role: string;
  firstName: string;
  lastName: string;
} | null;
export async function refreshAccessToken(): Promise<User | false> {
  try {
    const res = await axiosInstance.post('/auth/refresh', null, {
      withCredentials: true,
    });

    if (!res.data?.success || !res.data.user) {
      throw new Error('Не удалось обновить токен или нет пользователя');
    }

    return res.data.user;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      // Если 401 — значит токен невалиден или нет пользователя — возвращаем false
      //console.warn('Refresh token невалиден или отсутствует');
      return false;
    }
    console.error('Ошибка в refreshAccessToken:', error);
    return false;
  }
}
