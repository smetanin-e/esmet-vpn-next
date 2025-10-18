'use client';
//TODO НЕ ИСПОЛЬЗУЕТСЯ В ПРОЕКТЕ
import { useSession } from 'next-auth/react';

export const useUserSession = () => {
  const { data, status } = useSession();
  return { user: data?.user, isLoading: status === 'loading' };
};
