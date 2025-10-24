'use client';
import { AlertDialog } from '@/shared/components';
import { Button } from '@/shared/components/ui';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { usePeerMutations } from '../model/hooks/use-peer-mutation';

interface Props {
  className?: string;
  peerId: number;
}

export const DeletePeer: React.FC<Props> = ({ peerId }) => {
  const { deletePeer } = usePeerMutations();

  const handleDelete = async () => {
    try {
      await deletePeer.mutateAsync(peerId);
    } catch (error) {
      console.error('Failed to delete peer', error);
    }
  };
  return (
    <div>
      <AlertDialog
        trigger={
          <Button size={'icon'} variant='outline' className='text-red-400 hover:text-red-300'>
            <Trash2 className='w-4 h-4' />
          </Button>
        }
        description='Вы действительно хотите удалить конфигурацию VPN?'
        onConfirm={handleDelete}
      />
    </div>
  );
};
