import React from 'react';

import { cn } from '@/shared/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui';
import { PeerItem } from '@/entities/wg-peer/ui';
import { PeersQuantity } from '@/shared/components';

interface Props {
  className?: string;
  label: React.ReactNode;
  action?: React.ReactNode;
  client?: string;
}

export const Peers: React.FC<Props> = ({ className, label, action, client }) => {
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
              <PeersQuantity />
            </div>
            {action}
          </div>
        </CardHeader>
        <CardContent className='space-y-2 p-1 md:h-[550px] overflow-y-scroll'>
          <PeerItem client={client} />
          <PeerItem client={client} />
          <PeerItem client={client} />
          <PeerItem client={client} />
          <PeerItem client={client} />
          <PeerItem client={client} />
          <PeerItem client={client} />
          <PeerItem client={client} />
          <PeerItem client={client} />
        </CardContent>
      </>
      {/* )} */}
    </Card>
  );
};
