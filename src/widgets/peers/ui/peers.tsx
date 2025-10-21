'use client';
import React from 'react';

import { cn } from '@/shared/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui';
import { PeerItem } from '@/entities/wg-peer/ui';
import { PeersQuantity, ShowMore } from '@/shared/components';
import { CreatePeerModal } from '@/features/wg-peer/actions/ui/create-peer-modal';
import { useGetPeers } from '@/entities/wg-peer/api/use-get-peers';

interface Props {
  className?: string;
  label: React.ReactNode;
  action?: React.ReactNode;
  client?: string;
}

export const Peers: React.FC<Props> = ({ className, label }) => {
  const { data, status, error, hasNextPage, fetchNextPage, isFetchingNextPage } = useGetPeers();
  const peers = data?.pages.flatMap((page) => page.peers) ?? [];
  if (status === 'pending') {
    return <div className='p-4'>Загрузка пиров...</div>;
  }

  if (status === 'error') {
    return (
      <div className='p-4 text-red-500'>
        Ошибка: {error instanceof Error ? error.message : 'Не удалось получить список пиров ❌'}
      </div>
    );
  }
  return (
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
