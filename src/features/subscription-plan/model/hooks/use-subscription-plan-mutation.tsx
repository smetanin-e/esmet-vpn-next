import { useMutation } from '@tanstack/react-query';
import { addSubscriptionPlan } from '../../actions/add-subscription-plan';
import { queryClient } from '@/shared/lib';
import toast from 'react-hot-toast';

export const useSubscriptionPlanMutation = () => {
  const create = useMutation({
    mutationFn: addSubscriptionPlan,
    onSuccess: async (res) => {
      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
        toast.success('Тариф добавлен');
      } else {
        toast.error(res.message || 'Ошибка при создании тарифного плана');
      }
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : 'Не удалось создать тарифный план ❌');
    },
  });

  return { create };
};
