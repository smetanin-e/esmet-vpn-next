'use client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { zodResolver } from '@hookform/resolvers/zod';

import { createPeerSchema, CreatePeerType } from '../model/schemas/create-peer-schema';
import { createPeer } from '../actions/create-peer';

import { Button } from '@/shared/components/ui';
import { FormInput } from '@/shared/components/form';

interface Props {
  className?: string;
  userId: number;
  setOpen: (open: boolean) => void;
}

export const CreatePeerForm: React.FC<Props> = ({ setOpen, userId }) => {
  const form = useForm<CreatePeerType>({
    resolver: zodResolver(createPeerSchema),
  });

  const onSubmit = async (data: CreatePeerType) => {
    try {
      const res = await createPeer(data.name, userId);
      if (!res.success) {
        throw new Error(res.message);
      }
      setOpen(false);
      toast.success('Файл конфигурации успешно создан', { icon: '✅' });
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error [CREATE_PEER_FORM]', error);
        return toast.error(
          error instanceof Error ? error.message : 'Не удалось создать аккаунт ❌',
        );
      }
    }
  };
  return (
    <FormProvider {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-2'>
          <FormInput
            label='Название'
            name='name'
            id='name'
            type='text'
            placeholder='Введите название файла. Например: vpn'
            required
          />
        </div>

        <Button disabled={form.formState.isSubmitting} className='w-full' type='submit'>
          {form.formState.isSubmitting ? 'Создание конфигурации' : 'Создать'}
        </Button>
      </form>
    </FormProvider>
  );
};
