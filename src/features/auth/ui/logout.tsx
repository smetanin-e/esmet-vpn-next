'use client';
import React from 'react';

import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Button } from '@/shared/components/ui';
import toast from 'react-hot-toast';

interface Props {
  className?: string;
}
export const Logout: React.FC<Props> = () => {
  const logout = async () => {
    await signOut({ callbackUrl: '/' });

    toast('Выход из аккаунта');
  };
  return (
    <Button variant={'ghost'} size={'sm'} onClick={logout}>
      <LogOut className='w-4 h-4' />
    </Button>
  );
};
