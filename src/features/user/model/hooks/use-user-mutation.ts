import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../../actions/register-user';
import { queryClient } from '@/shared/lib';

export const useUserMutations = () => {
  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['users'] });
      }
    },
  });

  return {
    register: registerMutation,
  };
};
