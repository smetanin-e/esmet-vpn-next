import { Logout } from '@/features/auth';
import React from 'react';
interface Props {
  className?: string;
  title: string;
}

export const Header: React.FC<Props> = ({ title }) => {
  return (
    <div className=' mb-4 md:mb-6 md:flex md:justify-between md:items-center flex-wrap md:space-x-4'>
      <h1 className='text-3xl mb-2 font-bold text-center md:text-left'>{title}</h1>
      <div className='flex items-center space-x-4 justify-end md:justify-baseline'>
        <p className='text-white text-lg'>Сметанин Евгений</p>
        <Logout />
      </div>
    </div>
  );
};
