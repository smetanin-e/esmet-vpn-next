'use client';
import React from 'react';

import { cn } from '@/shared/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, Input } from '@/shared/components/ui';
import { PeerItem } from '@/entities/wg-peer/ui';
import { CleareButton, PeersQuantity, ShowMore } from '@/shared/components';
import { CreatePeerModal } from '@/features/wg-peer/ui/create-peer-modal';
import { useGetPeers } from '@/entities/wg-peer/api/use-get-peers';
import { UserRole } from '@prisma/client';

interface Props {
  className?: string;
  label: React.ReactNode;
  userRole?: UserRole;
}

export const Peers: React.FC<Props> = ({ className, label, userRole }) => {
  const [searchValue, setSearchValue] = React.useState('');
  const { data, status, error, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetPeers(searchValue);
  const peers = data?.pages.flatMap((page) => page.peers) ?? [];

  // Сбрасываем search при уходе со страницы
  React.useEffect(() => {
    return () => {
      setSearchValue('');
    };
  }, []);
  if (status === 'pending') {
    return <div className='p-4'>Загрузка пиров...</div>; //TODO ИСПРАВИТЬ ВЕРСТКУ И ОТОБРАЖЕНИЕ ЗАГРУЗКИ
  }

  if (status === 'error') {
    return (
      <div className='p-4 text-red-500'>
        Ошибка: {error instanceof Error ? error.message : 'Не удалось получить список пиров ❌'}
      </div>
    );
  }

  return (
    //TODO Сделать чтобы верстка не прыгала при загрузке данных
    <Card
      className={cn(
        'bg-slate-800/50 border-blue-600 backdrop-blur-sm relative  max-w-full',
        className,
      )}
    >
      {label}
      {/* {loading ? (
        <LoadingBounce />
      ) : ( */}
      <>
        <CardHeader className='mb-0 pb-0'>
          <CardTitle>Конфигурация WireGuard</CardTitle>
          <div className='flex items-center justify-between space-x-6 text-sm'>
            <div className='flex space-x-6'>
              <PeersQuantity peers={peers} />
            </div>
            {userRole && (
              <div className='w-xl relative'>
                <Input
                  placeholder='Поиск по логину или имени клиента'
                  className=''
                  type='text'
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                {searchValue && <CleareButton onClick={() => setSearchValue('')} />}
              </div>
            )}

            <CreatePeerModal />
          </div>
        </CardHeader>
        <CardContent className='space-y-2 p-1 md:h-[550px] overflow-y-scroll'>
          {peers.map((peer) => (
            <PeerItem key={peer.id} peer={peer} />
          ))}

          {hasNextPage && (
            <ShowMore onClick={() => fetchNextPage()} disabled={isFetchingNextPage} />
          )}
        </CardContent>
      </>
      {/* )} */}
    </Card>
  );
};
