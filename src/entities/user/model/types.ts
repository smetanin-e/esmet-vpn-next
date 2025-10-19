import { UserSubscription } from '@/entities/subscription/model/types';
import { TransactionDTO } from '@/entities/transaction/model/types';
import { PeerDTO } from '@/entities/wg-peer/model/types';

export type UserDTO = {
  id: number;
  login: string;
  role: string;
  firstName: string;
  lastName: string;
  balance: number;
  status: boolean;
  subsEnd: Date | null;
  telegram: string;
  subscription: UserSubscription | null;
  transactions: TransactionDTO[] | null;
  peers: PeerDTO[] | null;
};
