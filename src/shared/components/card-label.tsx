import React from 'react';
import { Badge } from './ui';

interface Props {
  className?: string;
  text: string;
}

export const CardLabel: React.FC<Props> = ({ text }) => {
  return (
    <Badge className='absolute z-2 -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white'>
      {text}
    </Badge>
  );
};
