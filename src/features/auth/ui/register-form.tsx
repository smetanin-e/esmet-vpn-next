'use client';
import React from 'react';
import { Button } from '@/shared/components/ui';
import { FormProvider, useForm } from 'react-hook-form';
import { AtSign } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { registerUserSchema, RegisterUserType } from '../model/schemas/register-schema';
import { FormInput } from '@/shared/components/form';
import { registerUser } from '../actions/register-user';
import { FormSubscriptionSelect } from '@/shared/components/form/form-subscription-select';

interface Props {
  className?: string;
  onClose?: () => void;
}

export const RegisterForm: React.FC<Props> = ({ onClose }) => {
  const form = useForm<RegisterUserType>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '+7',
      login: '',
      password: '',
      confirmPassword: '',
      telegram: '',
    },
  });

  const onSubmit = async (data: RegisterUserType) => {
    try {
      const res = await registerUser(data);
      if (!res.success) {
        throw new Error(res.message);
      }
      toast.success('Аккаунт успешно создан! ✅');
      onClose?.();
      form.reset();
    } catch (error) {
      console.log('Error [REGISTER_FORM]', error);
      return toast.error(error instanceof Error ? error.message : 'Не удалось создать аккаунт ❌');
    }
  };

  return (
    <FormProvider {...form}>
      <form className='space-y-6' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid grid-cols-2 gap-4 mb-6'>
          <FormInput
            label='Имя'
            name='firstName'
            id='firstName'
            type='text'
            placeholder='Имя'
            required
          />

          <FormInput
            label='Фамилия'
            name='lastName'
            id='lastName'
            type='text'
            placeholder='Фамилия'
            required
          />
        </div>

        <FormInput
          label='telegram'
          name='telegram'
          id='telegram'
          type='text'
          placeholder='user' // https://t.me/user
          required
        >
          <AtSign className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
        </FormInput>

        <FormInput label='Телефон' name='phone' id='phone' type='tel' required />

        <FormSubscriptionSelect required name='subscription' label='Выберите подписку' />

        <FormInput label='Логин' name='login' id='login' type='text' placeholder='Логин' required />

        <FormInput
          label='Пароль'
          name='password'
          id='password'
          type='password'
          placeholder='Введите пароль'
          required
        />

        <FormInput
          label='Повторите пароль'
          name='confirmPassword'
          id='confirmPassword'
          type='password'
          placeholder='Повторите пароль'
          required
        />

        <Button className='w-full mt-6' type='submit' disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Загрузка...' : 'Создать'}
        </Button>
      </form>
    </FormProvider>
  );
};
