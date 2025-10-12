import { ShieldCheck, ShieldMinus } from 'lucide-react';
import React from 'react';

interface Props {
  className?: string;
}

export const PeersQuantity: React.FC<Props> = () => {
  return (
    <>
      <div className='flex items-center space-x-2 text-green-300  '>
        <ShieldCheck className='h-4 w-4' />
        <p className=' font-bold '>2</p>
      </div>

      <div className='flex items-center space-x-2 text-red-400  '>
        <ShieldMinus className='h-4 w-4' />
        <p className=' font-bold '>1</p>
      </div>
    </>
  );
};
