'use client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { PaymentFormType, paymentSchema } from '@/features/transaction/model/payment-schema';
import { transactionApi } from '../api/transaction.api';
import { FormInput } from '@/shared/components/form';
import { Button } from '@/shared/components/ui';

interface Props {
  className?: string;
  onClose: VoidFunction;
}

export const PaymentForm: React.FC<Props> = ({ onClose }) => {
  const form = useForm<PaymentFormType>({
    resolver: zodResolver(paymentSchema),
  });

  const onSubmit = async (data: PaymentFormType) => {
    try {
      const paymentUrl = await transactionApi.payment(data);

      if (!paymentUrl) {
        throw new Error('Не удалось получить ссылку на оплату');
      }
      // сразу редиректим пользователя на оплату
      window.location.href = paymentUrl;
      toast.success('Переход на оплату ✅');
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error [PAYMENT_FORM]', error);
        return toast.error(error.message, { icon: '❌' });
      }
    }
  };
  return (
    <FormProvider {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-2'>
          <FormInput
            label='Сумма'
            name='amount'
            id='amount'
            type='text'
            placeholder='Введите сумму...'
            required
          />
        </div>

        <Button disabled={form.formState.isSubmitting} className='w-full' type='submit'>
          {form.formState.isSubmitting ? 'Переход на оплату' : 'Оплатить'}
        </Button>
      </form>
    </FormProvider>
  );
};
