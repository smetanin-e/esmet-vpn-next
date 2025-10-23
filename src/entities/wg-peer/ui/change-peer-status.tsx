'use client';

import { usePeerMutations } from '@/features/wg-peer/model/hooks/use-peer-mutation';
import { Spinner, Switch } from '@/shared/components/ui';
import { WgPeerStatus } from '@prisma/client';
import React from 'react';

interface Props {
  className?: string;
  id: number;
  userId: number;
  status: WgPeerStatus;
}

export const ChangePeerStatus: React.FC<Props> = ({ id, userId, status }) => {
  const { toggleStatus } = usePeerMutations();
  const handleToggle = async (id: number, userId: number) => {
    try {
      await toggleStatus.mutateAsync({ peerId: id, userId });
    } catch (error) {
      console.error('Failed to toggle peer status', error);
    }
  };
  return (
    <div className='text-right md:text-center'>
      {toggleStatus.isLoading ? (
        <div className='flex items-center justify-center'>
          <Spinner className='w-8 h-8' />
        </div>
      ) : (
        <Switch
          checked={status === WgPeerStatus.ACTIVE}
          onCheckedChange={() => handleToggle(id, userId)}
          className='data-[state=checked]:bg-success data-[state=unchecked]:bg-gray-400'
        />
      )}
    </div>
  );
};
