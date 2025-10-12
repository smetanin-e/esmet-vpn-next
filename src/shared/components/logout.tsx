'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Button } from './ui';
import { LogOut } from 'lucide-react';

interface Props {
  className?: string;
}
//TODO ПЕРЕНЕСТИ КОМПОНЕНТ
export const Logout: React.FC<Props> = () => {
  const router = useRouter();

  const logout = () => {
    router.push('/');
  };
  return (
    <Button variant={'ghost'} size={'sm'} onClick={logout}>
      <LogOut className='w-4 h-4' />
    </Button>
  );
};
