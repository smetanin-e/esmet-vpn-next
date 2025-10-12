import React from 'react';
import { Button } from './ui';
import { Ellipsis } from 'lucide-react';

interface Props {
  className?: string;
}

export const ShowMore: React.FC<Props> = () => {
  return (
    <div className='mt-4 flex items-center justify-center'>
      <Button size={'icon-sm'} variant={'ghost'}>
        <Ellipsis className='w-4 h-4' />
      </Button>
    </div>
  );
};
