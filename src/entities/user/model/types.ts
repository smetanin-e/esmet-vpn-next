import { UserSubscription } from '@/entities/subscription/model/types';

export type AuthUserType = {
  id: number;
  login: string;
  role: string;
  firstName: string;
  lastName: string;
  balance: number;
  status: boolean;
  subsEnd: Date | null;
  subscription: UserSubscription | null;
};
