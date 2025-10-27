import { useMutation } from '@tanstack/react-query';
import { queryClient } from '@/shared/lib';
import { registerUser } from '../../actions/register-user';
import { toggleUserStatusAction } from '../../actions/toggle-status-user';
import toast from 'react-hot-toast';
import { deleteUserAction } from '../../actions/delete-user';

export const useUserMutations = () => {
  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: async (res) => {
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
        toast.success('Аккаунт успешно создан! ✅');
      } else {
        toast.error(res.message || 'Ошибка при создании пользователя ❌');
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Не удалось создать аккаунт ❌');
    },
  });

  const toggleUserStatus = useMutation({
    mutationFn: toggleUserStatusAction,
    onSuccess: async (res) => {
      if (res.success) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['peers'] }),
          queryClient.invalidateQueries({ queryKey: ['users'] }),
        ]);
        toast.success('Статус пользователя изменен');
      } else {
        toast.error(res.message || 'Ошибка при изменении статуса');
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Не удалось изменить статус пользователя ❌',
      );
    },
  });

  const deleteUser = useMutation({
    mutationFn: deleteUserAction,
    onSuccess: async (res) => {
      if (res.success) {
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['peers'] }),
          queryClient.invalidateQueries({ queryKey: ['users'] }),
        ]);
        toast.success('Пользователь удален');
      } else {
        toast.error(res.message || 'Ошибка при удалении пользователя');
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Не удалось удалить пользователя ❌');
    },
  });

  return {
    register: registerMutation,
    toggleUserStatus: {
      mutateAsync: toggleUserStatus.mutateAsync,
      isLoading: toggleUserStatus.isPending,
    },
    deleteUser: {
      mutateAsync: deleteUser.mutateAsync,
      isLoading: deleteUser.isPending,
    },
  };
};
