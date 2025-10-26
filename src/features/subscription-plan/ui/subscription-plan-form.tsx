'use client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  SubscriptionPlanFormType,
  subscriptionPlanSchema,
} from '../model/schemas/subcription-plan-schema';
import { FormInput, FormTextarea } from '@/shared/components/form';
import { Button } from '@/shared/components/ui';
import { useSubscriptionPlanMutation } from '../model/hooks/use-subscription-plan-mutation';

interface Props {
  className?: string;
  setOpen: (open: boolean) => void;
}

export const FormSubscriptionPlan: React.FC<Props> = ({ setOpen }) => {
  const { create } = useSubscriptionPlanMutation();
  const form = useForm<SubscriptionPlanFormType>({
    resolver: zodResolver(subscriptionPlanSchema),
    defaultValues: {
      name: '',
      description: '',
      dailyPrice: '',
    },
  });
  const onSubmit = async (data: SubscriptionPlanFormType) => {
    try {
      await create.mutateAsync(data);
      setOpen(false);
    } catch (error) {
      console.log('Error [SUBSCRIPTION_FORM]', error);
    }
  };
  return (
    <FormProvider {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-2'>
          <FormInput
            label='Название подписки'
            name='name'
            id='name'
            type='text'
            placeholder='Например Стандарт'
            required
          />
        </div>

        <div className='space-y-2 relative'>
          <FormInput
            label='Тариф'
            name='dailyPrice'
            id='dailyPrice'
            type='text'
            placeholder='Стоимость 1 конфига за 1 день'
            required
          />
        </div>

        <div className='space-y-2 relative'>
          <FormInput
            label='Количество конфигов для одного пользователя'
            name='maxPeers'
            id='maxPeers'
            type='text'
            placeholder='Например 5'
            required
          />
        </div>

        <div className='space-y-2'>
          <FormTextarea
            label='Описание'
            name='description'
            id='description'
            placeholder='Описание'
            required
          />
        </div>

        <Button className='w-full' type='submit' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Создание подписки...' : 'Создать'}
        </Button>
      </form>
    </FormProvider>
  );
};
