'use client';

import { Switch } from '@/shared/components/ui';
import React from 'react';
import { useUserMutations } from '../model/hooks/use-user-mutation';

interface Props {
  className?: string;
  userId: number;
  status: boolean;
}

export const ChangeUserStatus: React.FC<Props> = ({ userId, status }) => {
  const { toggleUserStatus } = useUserMutations();
  const handleToggle = async (userId: number) => {
    try {
      await toggleUserStatus.mutateAsync(userId);
    } catch (error) {
      console.error('Failed to toggle peer status', error);
    }
  };
  return (
    <div className='text-right md:text-center'>
      <Switch
        disabled={toggleUserStatus.isLoading}
        checked={status}
        onCheckedChange={() => handleToggle(userId)}
        className='data-[state=checked]:bg-success data-[state=unchecked]:bg-gray-400'
      />
    </div>
  );
};
