import { axiosInstance } from '@/shared/service/instance';
import { useQuery } from '@tanstack/react-query';
import { UserDTO } from '../model/types';

export const useGetUsers = () => {
  return useQuery<UserDTO[]>({
    queryKey: ['users'],
    queryFn: async () => {
      return (
        await axiosInstance.get<UserDTO[]>('/user', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_READ_KEY}`,
          },
        })
      ).data;
    },
  });
};
