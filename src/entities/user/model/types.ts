import { TransactionDTO } from '@/entities/transaction/model/types';
import { UserSubscriptionDTO } from '@/entities/user-subscription/model/type';
import { PeerDTO } from '@/entities/wg-peer/model/types';

export type UserDTO = {
  id: number;
  login: string;
  role: string;
  firstName: string;
  lastName: string;
  balance: number;
  status: boolean;
  telegram: string;
  userSubscription: UserSubscriptionDTO | null;
  transactions: TransactionDTO[] | null;
  peers: PeerDTO[] | null;
};
