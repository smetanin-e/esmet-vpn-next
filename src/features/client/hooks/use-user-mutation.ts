import { useMutation } from '@tanstack/react-query';

import { queryClient } from '@/shared/lib';
import { registerUser } from '../actions/register-user';

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
