'use client';
import { AlertDialog } from '@/shared/components';
import { Button } from '@/shared/components/ui';
import { Trash2 } from 'lucide-react';
import React from 'react';
import { useUserMutations } from '../model/hooks/use-user-mutation';

interface Props {
  className?: string;
  userId: number;
  userName: string;
}

export const DeleteUser: React.FC<Props> = ({ userId, userName }) => {
  const { deleteUser } = useUserMutations();

  const handleDelete = async () => {
    try {
      await deleteUser.mutateAsync(userId);
    } catch (error) {
      console.error('Failed to delete user', error);
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
        description={`Вы действительно хотите удалить пользователя - ${userName}?`}
        onConfirm={handleDelete}
      />
    </div>
  );
};
