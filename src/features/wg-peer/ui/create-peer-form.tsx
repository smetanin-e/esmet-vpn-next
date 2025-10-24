'use client';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPeerSchema, CreatePeerType } from '../model/schemas/create-peer-schema';
import { Button } from '@/shared/components/ui';
import { FormInput } from '@/shared/components/form';
import { usePeerMutations } from '../model/hooks/use-peer-mutation';

interface Props {
  className?: string;
  userId: number;
  setOpen: (open: boolean) => void;
}

export const CreatePeerForm: React.FC<Props> = ({ setOpen, userId }) => {
  const { createPeer } = usePeerMutations();
  const form = useForm<CreatePeerType>({
    resolver: zodResolver(createPeerSchema),
  });

  const onSubmit = async (data: CreatePeerType) => {
    try {
      await createPeer.mutateAsync({ name: data.name, userId });
      setOpen(false);
    } catch (error) {
      console.log('Error [CREATE_PEER_FORM]', error);
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
