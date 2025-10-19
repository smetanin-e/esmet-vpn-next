'use client';
import { Logout } from '@/features/auth';
import { UserRole } from '@prisma/client';
import Link from 'next/link';
import React from 'react';
import { Button } from './ui';
import { usePathname } from 'next/navigation';
interface Props {
  className?: string;
  title: string;
  name: string;
  role?: string;
}

export const Header: React.FC<Props> = ({ title, name, role }) => {
  const pathname = usePathname();
  const link = pathname === '/admin-dashboard' ? '/dashboard' : '/admin-dashboard';
  const linkLabel = pathname === '/admin-dashboard' ? 'Личный кабинет' : 'Админ панель';

  return (
    <div className=' mb-4 md:mb-6 md:flex md:justify-between md:items-center flex-wrap md:space-x-4'>
      <h1 className='text-3xl mb-2 font-bold text-center md:text-left'>{title}</h1>

      <div className='flex items-center space-x-4 justify-end md:justify-baseline'>
        {role === UserRole.ADMIN && (
          <Link href={link}>
            <Button variant={'ghost'}>{linkLabel}</Button>
          </Link>
        )}
        <p className='text-white text-lg'>{name}</p>
        <Logout />
      </div>
    </div>
  );
};
