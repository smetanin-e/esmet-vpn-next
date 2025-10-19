import { WireguardPeer } from '@prisma/client';

export type PeerDTO = Pick<WireguardPeer, 'peerName' | 'status'>;
