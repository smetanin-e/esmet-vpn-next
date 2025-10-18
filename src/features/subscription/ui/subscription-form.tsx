'use client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';

import toast from 'react-hot-toast';
import { SubscriptionFormType, subscriptionSchema } from '../model/schemas/subcription-schema';
import { FormInput, FormTextarea } from '@/shared/components/form';
import { Button } from '@/shared/components/ui';
import { addSubscription } from '../actions/add-subscription';
import { queryClient } from '@/shared/lib';

interface Props {
  className?: string;
  setOpen: (open: boolean) => void;
}

export const FormSubscription: React.FC<Props> = ({ setOpen }) => {
  const form = useForm<SubscriptionFormType>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: '',
      description: '',
      dailyPrice: '',
    },
  });
  const onSubmit = async (data: SubscriptionFormType) => {
    try {
      const res = await addSubscription(data);
      if (!res.success) {
        throw new Error(res.message);
      }
      toast.success('Подписка добавлена ✅');
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      setOpen(false);
    } catch (error) {
      console.log('Error [SUBSCRIPTION_FORM]', error);
      return toast.error(error instanceof Error ? error.message : 'Не удалось создать подписку ❌');
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
