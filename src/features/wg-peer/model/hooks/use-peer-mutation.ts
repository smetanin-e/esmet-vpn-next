import { useMutation } from '@tanstack/react-query';
import { togglePeerStatusAction } from '../../actions/toggle-activate-peer';
import { queryClient } from '@/shared/lib';
import toast from 'react-hot-toast';
import { createPeerAction } from '../../actions/create-peer';
import { deletePeerAction } from '../../actions/delete-peer';

export const usePeerMutations = () => {
  const createPeer = useMutation({
    mutationFn: createPeerAction,
    onSuccess: async (res) => {
      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ['peers'] });
        toast.success('VPN успешно создан');
      } else {
        toast.error(res.message || 'Ошибка при создании конфигурации VPN');
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Не удалось создать конфигурацию VPN ❌',
      );
    },
  });

  const togglePeerStatus = useMutation({
    mutationFn: togglePeerStatusAction,
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

  const deletePeer = useMutation({
    mutationFn: deletePeerAction,
    onSuccess: async (res) => {
      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ['peers'] });
        toast.success('VPN успешно удален');
      } else {
        toast.error(res.message || 'Ошибка при удалении конфигурации VPN');
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Не удалось удалить конфигурацию VPN ❌',
      );
    },
  });

  return {
    togglePeerStatus: {
      mutateAsync: togglePeerStatus.mutateAsync,
      isLoading: togglePeerStatus.isPending,
    },
    createPeer,
    deletePeer: {
      isLoading: deletePeer.isPending,
      mutateAsync: deletePeer.mutateAsync,
    },
  };
};
