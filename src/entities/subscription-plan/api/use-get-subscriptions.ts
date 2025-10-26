import { axiosInstance } from '@/shared/service/instance';
import { SubscriptionPlan } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';

export const useGetSubscriptionPlans = () => {
  return useQuery<SubscriptionPlan[]>({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      return (
        await axiosInstance.get<SubscriptionPlan[]>('/subscription-plan', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_READ_KEY}`,
          },
        })
      ).data;
    },
  });
};
