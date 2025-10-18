'use client';

import { useSession } from 'next-auth/react';

export const useUserSession = () => {
  const { data, status } = useSession();
  return { user: data?.user, isLoading: status === 'loading' };
};
