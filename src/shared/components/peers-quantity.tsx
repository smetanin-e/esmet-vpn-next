import { PeerDTO } from '@/entities/wg-peer/model/types';
import { WgPeerStatus } from '@prisma/client';
import { ShieldCheck, ShieldMinus } from 'lucide-react';
import React from 'react';

interface Props {
  className?: string;
  peers: PeerDTO[] | null;
}

export const PeersQuantity: React.FC<Props> = ({ peers }) => {
  const activePeers = peers
    ? peers.filter((peer) => peer.status === WgPeerStatus.ACTIVE).length
    : 0;
  const diabledPeers = peers ? peers.length - activePeers : 0;
  return (
    <>
      <div className='flex items-center space-x-2 text-green-300  '>
        <ShieldCheck className='h-4 w-4' />
        <p className=' font-bold '>{activePeers}</p>
      </div>

      <div className='flex items-center space-x-2 text-red-400  '>
        <ShieldMinus className='h-4 w-4' />
        <p className=' font-bold '>{diabledPeers}</p>
      </div>
    </>
  );
};
