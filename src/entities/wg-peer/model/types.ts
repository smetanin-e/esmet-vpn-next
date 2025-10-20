import { User, WireguardPeer } from '@prisma/client';

export type PeerDTO = Pick<WireguardPeer, 'peerName' | 'status'>;
export type PeerQueryType = {
  id: number;
  peerName: string;
  status: boolean;
  user: Pick<User, 'login' | 'firstName' | 'lastName'>;
};
