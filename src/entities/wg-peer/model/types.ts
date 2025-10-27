import { User, WgPeerStatus, WireguardPeer } from '@prisma/client';

export type PeerDTO = Pick<WireguardPeer, 'peerName' | 'status'>;
export type PeerQueryType = {
  id: number;
  peerName: string;
  status: WgPeerStatus;
  user: Pick<User, 'id' | 'login' | 'firstName' | 'lastName'>;
};

export interface WireguardServerPeer {
  id: number;
  server_public_key: string;
  address: string;
  address_ipv6: string;
  private_key: string;
  public_key: string;
  preshared_key: string;
  enable: boolean;
  allowed_ips: string;
  dns: string | null;
  persistent_keepalive: number;
  endpoint: string;
  last_online: string | Date | null;
  traffic: {
    received: number;
    sent: number;
  } | null;
  data: {
    name: string;
  };
}
