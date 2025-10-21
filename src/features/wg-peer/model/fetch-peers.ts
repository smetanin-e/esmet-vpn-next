import { PeerQueryType } from '@/entities/wg-peer/model/types';
import { axiosInstance } from '@/shared/service/instance';
import { number } from 'zod';

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
  const { peers, totalCount } = (
    await axiosInstance.get<{ peers: PeerQueryType[]; totalCount: number }>(
      `/peer?take=${take}&skip=${skip}`,
      { headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_READ_KEY}` } },
    )
  ).data;

  if (!peers) {
    throw new Error('Ошибка при загрузке пиров');
  }

  const nextPage = skip + peers.length < totalCount ? pageParam + 1 : undefined;
  return {
    peers: peers,
    nextPage,
  };
};
