import { axiosInstance } from '@/shared/service/instance';
import { useQuery } from '@tanstack/react-query';
import { SubscriptionType } from '../model/types';

export const useGetSubscriptions = () => {
  return useQuery<SubscriptionType[]>({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      return (
        await axiosInstance.get('/subscription', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_READ_KEY}`,
          },
        })
      ).data;
    },
  });
};
