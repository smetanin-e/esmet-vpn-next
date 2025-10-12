import { AlertDialog, WgLogo } from '@/shared/components';
import { Button, Switch } from '@/shared/components/ui';
import { Download, QrCode, Trash2 } from 'lucide-react';
import React from 'react';

interface Props {
  className?: string;
  client?: string;
}
// ? "bg-slate-900/50 border-slate-700 hover:border-slate-600"
// : "bg-slate-800/40 border-slate-800 opacity-50 "    pointer-events-none
export const PeerItem: React.FC<Props> = ({ client }) => {
  return (
    <div className='space-y-4'>
      <div className='p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors'>
        {client && <p className='text-right text-sm mb-1'>{client}</p>}
        <div className='grid grid-cols-[auto_1fr] items-center space-x-6'>
          <div className='flex flex-col space-y-2'>
            <div className='text-center'>
              <WgLogo width={25} height={25} />
            </div>

            <p className='text-xs'>vpn-1 sdsd sds</p>
          </div>

          <div className='flex items-center justify-end gap-4'>
            <div className='text-right md:text-center'>
              <Switch
                checked={true}
                className='data-[state=checked]:bg-success data-[state=unchecked]:bg-gray-400'
              />
            </div>
            <div>
              <Button size={'icon'} variant='outline'>
                <Download className='w-4 h-4' />
              </Button>
            </div>
            <div>
              {' '}
              <Button size={'icon'} variant='outline'>
                <QrCode className='w-4 h-4' />
              </Button>
            </div>

            <div>
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
