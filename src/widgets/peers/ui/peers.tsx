'use client';
import React from 'react';

import { cn } from '@/shared/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui';
import { PeerItem } from '@/entities/wg-peer/ui';
import { LoadingBounce, PeersQuantity, ShowMore } from '@/shared/components';
import { CreatePeerModal } from '@/features/wg-peer/ui/create-peer-modal';
import { UserRole } from '@prisma/client';
import { SearchPeer } from '@/entities/wg-peer/ui/search-peer';
import { useGetPeers } from '@/entities/wg-peer/model/hooks/use-get-peers';

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
        'bg-slate-800/50 border-blue-600 backdrop-blur-sm relative  max-w-full min-h-80',
        className,
      )}
    >
      {label}
      {status === 'pending' ? (
        <LoadingBounce />
      ) : (
        <>
          <CardHeader className='mb-0 pb-0'>
            <CardTitle>Конфигурация WireGuard</CardTitle>
            <div className='flex items-center justify-between space-x-6 text-sm'>
              <div className='flex space-x-6'>
                <PeersQuantity peers={peers} />
              </div>
              {userRole && <SearchPeer searchValue={searchValue} setSearchValue={setSearchValue} />}

              <CreatePeerModal />
            </div>
          </CardHeader>
          <CardContent className='space-y-2 p-1'>
            {peers.map((peer) => (
              <PeerItem key={peer.id} peer={peer} />
            ))}

            {hasNextPage && (
              <ShowMore onClick={() => fetchNextPage()} disabled={isFetchingNextPage} />
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};
