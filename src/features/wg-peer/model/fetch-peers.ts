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
  const query = new URLSearchParams({
    take: take.toString(),
    skip: skip.toString(),
  });

  if (search) {
    query.set('search', search);
  }
  const { data } = await axiosInstance.get<PeerQueryType[]>(`/peer?${query.toString()}`, {
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
