import React from 'react';
import { Send, Trash2 } from 'lucide-react';
import { AlertDialog, PeersQuantity } from '@/shared/components';
import { Button } from '@/shared/components/ui';
import { UserDTO } from '../model/types';
import Link from 'next/link';
import { ChangeUserStatus } from '@/features/client/ui/change-user-status';
import { useGetPeers } from '@/entities/wg-peer/model/hooks/use-get-peers';

interface Props {
  className?: string;
  user: UserDTO;
}
//TODO ЕСЛИ НАДО, ДОБАВИТЬ БАЛАНС КАЖДОГО ПОЛЬЗОВАТЕЛЯ
//!ДОБАВИТЬ СКРОЛ НА СПИСОК ПОЛЬЗОВАТЕЛЕЙ И ПОИСК
export const ClientItem: React.FC<Props> = ({ user }) => {
  const { data } = useGetPeers();
  const peers =
    data?.pages.flatMap((page) => page.peers).filter((peer) => peer.user.id === user.id) ?? [];
  return (
    <div className='space-y-4'>
      <div className='p-4 bg-slate-900/50 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors'>
        <div className='sm:flex sm:items-center sm:justify-between sm:space-x-2'>
          <div className='flex space-x-4 items-center justify-between mb-2 sm:block sm:mb-0'>
            <p className=' text-sm'>{`${user.lastName} ${user.firstName}`}</p>
            <p>{user.login}</p>
          </div>

          <div className='flex items-center justify-between space-x-6'>
            <Link href={user.telegram} target='_blank'>
              <Button
                size={'sm'}
                className='bg-blue-500 text-white rounded-full h-8 w-8 hover:bg-blue-400 hover:text-white'
              >
                <Send />
              </Button>
            </Link>
            <div className='flex space-x-2'>
              <PeersQuantity peers={peers} />
            </div>

            <ChangeUserStatus userId={user.id} status={user.status} />

            <div className='flex items-center gap-4'>
              <AlertDialog
                description='!!!'
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
