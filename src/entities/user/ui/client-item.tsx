import React from 'react';
import { Trash2 } from 'lucide-react';
import { AlertDialog, PeersQuantity } from '@/shared/components';
import { Button, Switch } from '@/shared/components/ui';

interface Props {
  className?: string;
}

export const ClientItem: React.FC<Props> = () => {
  return (
    <div className='space-y-4'>
      <div className='p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors'>
        <div className='flex items-center justify-between space-x-2'>
          <p className=' text-sm mb-1'>Сметанин Евгений</p>
          <div className='flex items-center space-x-6'>
            <div className='flex space-x-2'>
              <PeersQuantity />
            </div>

            <Switch
              checked={true}
              className='data-[state=checked]:bg-success data-[state=unchecked]:bg-gray-400'
            />

            <div className='flex items-center gap-4'>
              <AlertDialog
                trigger={
                  <Button
                    size={'icon'}
                    variant='outline'
                    className='text-red-400 hover:text-red-300'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
