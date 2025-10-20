import { User, WgPeerStatus, WireguardPeer } from '@prisma/client';

export type PeerDTO = Pick<WireguardPeer, 'peerName' | 'status'>;
export type PeerQueryType = {
  id: number;
  peerName: string;
  status: WgPeerStatus;
  user: Pick<User, 'login' | 'firstName' | 'lastName'>;
};
