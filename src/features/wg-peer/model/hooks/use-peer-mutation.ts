import { useMutation } from '@tanstack/react-query';
import { toggleActivatePeer } from '../../actions/toggle-activate-peer';
import { queryClient } from '@/shared/lib';
import toast from 'react-hot-toast';

export const usePeerMutations = () => {
  const toggleStatus = useMutation({
    mutationFn: toggleActivatePeer,
    onSuccess: async (res) => {
      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ['peers'] });
        toast.success('Статус изменен');
      } else {
        toast.error(res.message || 'Ошибка при изменении статуса');
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Не удалось изменить статус конфигурации ❌',
      );
    },
  });

  return {
    toggleStatus: {
      mutateAsync: toggleStatus.mutateAsync,
      isLoading: toggleStatus.isPending,
    },
  };
};
