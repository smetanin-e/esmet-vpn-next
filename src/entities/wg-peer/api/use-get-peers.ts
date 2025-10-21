import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPeers } from '@/features/wg-peer/model/fetch-peers';

export const useGetPeers = (search?: string) => {
  return useInfiniteQuery({
    queryKey: ['peers', search],
    queryFn: fetchPeers,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
