import { PeerQueryType } from '@/entities/wg-peer/model/types';
import { axiosInstance } from '@/shared/service/instance';

interface FetchPeersParams {
  pageParam?: number; // номер страницы для useInfiniteQuery
  search?: string; // строка поиска (только для админа)
}

export const fetchPeers = async ({
  pageParam = 0,
  search = '',
}: FetchPeersParams): Promise<{
  peers: PeerQueryType[];
  nextPage: number | undefined;
}> => {
  const take = 2;
  const skip = pageParam * take;
  const params = new URLSearchParams();
  params.set('take', take.toString());
  params.set('skip', skip.toString());
  if (search.trim()) params.set('search', search.trim());
  const { data } = await axiosInstance.get<PeerQueryType[]>(`/peer?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_READ_KEY}`,
    },
  });

  if (!data) {
    throw new Error('Ошибка при загрузке пиров');
  }

  const hasMore = data.length === take;
  return {
    peers: data,
    nextPage: hasMore ? pageParam + 1 : undefined,
  };
};
