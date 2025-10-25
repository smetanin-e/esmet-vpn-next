import { WgLogo } from '@/shared/components';
import React from 'react';
import { PeerQueryType } from '../model/types';
import { cn } from '@/shared/lib';
import { WgPeerStatus } from '@prisma/client';
import { DeletePeer } from '@/features/wg-peer/ui/delete-peer';
import { Qr } from './qr';
import { DownloadConf } from './download-conf';
import { ChangePeerStatus } from '@/features/wg-peer/ui/change-peer-status';

interface Props {
  className?: string;

  peer: PeerQueryType;
}

export const PeerItem: React.FC<Props> = ({ peer }) => {
  return (
    <div className='space-y-4'>
      <div
        className={cn(
          peer.status === WgPeerStatus.ACTIVE
            ? 'bg-slate-900/50 border-slate-700 hover:border-slate-600 '
            : 'bg-slate-800/40 border-slate-800 opacity-80',
          'p-4 transition-colors',
        )}
      >
        {peer.user && (
          <p
            onClick={() => alert(peer.user.id)}
            className='text-right text-sm mb-1'
          >{`${peer.user.lastName} ${peer.user.firstName}`}</p>
        )}
        <div className='grid grid-cols-[auto_1fr] items-center space-x-6'>
          <div className='flex flex-col space-y-2'>
            <div className='text-center'>
              <WgLogo width={25} height={25} />
            </div>

            <p className='text-xs'>{peer.peerName}</p>
          </div>

          <div className='flex items-center justify-end gap-4'>
            <ChangePeerStatus id={peer.id} status={peer.status} userId={peer.user.id} />
            <div>
              <DownloadConf peerId={peer.id} peerName={peer.peerName} />
            </div>
            <div>
              <Qr peerId={peer.id} peerName={peer.peerName} />
            </div>

            <DeletePeer peerId={peer.id} />
          </div>
        </div>
      </div>
    </div>
  );
};
