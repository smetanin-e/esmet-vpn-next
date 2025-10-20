import { axiosInstance } from '@/shared/service/instance';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PeerQueryType } from '../model/types';

interface PaginatedPeers {
  peers: PeerQueryType[];
  nextCursor: number | null;
}

export const useGetPeers = (userId?: number, limit = 5) => {
  return useInfiniteQuery<PaginatedPeers>({
    queryKey: ['peers', userId],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (userId) params.set('userId', userId.toString());
      if (pageParam) params.set('cursor', pageParam.toString());
      params.set('limit', limit.toString());

      const url = `/peer?${params.toString()}`;
      const { data } = await axiosInstance.get<PaginatedPeers>(url, {
        headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_READ_KEY}` },
      });
      return data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};
