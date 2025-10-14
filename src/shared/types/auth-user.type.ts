type UserSubscription = {
  name: string;
  dailyPrice: number;
  description: string;
  maxPeers: number;
};
//тип авторизованного пользователя
export type AuthUser = {
  id: number;
  login: string;
  role: string;
  firstName: string;
  lastName: string;
  balance: number;
  subsEnd: Date | null;
  subscription: UserSubscription | null;
};
