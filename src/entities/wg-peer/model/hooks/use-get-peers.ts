import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPeers } from '@/features/wg-peer/model/fetch-peers';
import { useDebounce } from 'react-use';
import React from 'react';

export const useGetPeers = (search?: string) => {
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);

  // Делаем debounce на входной строке
  useDebounce(
    () => {
      setDebouncedSearch(search);
    },
    500,
    [search],
  );
  return useInfiniteQuery({
    queryKey: ['peers', debouncedSearch],
    queryFn: ({ pageParam = 0 }) => fetchPeers({ pageParam, search: debouncedSearch }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
