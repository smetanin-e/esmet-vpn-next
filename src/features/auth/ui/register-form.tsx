'use client';
import React from 'react';
import { Button } from '@/shared/components/ui';
import { FormProvider, useForm } from 'react-hook-form';
import { AtSign } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { registerUserSchema, RegisterUserType } from '../model/schemas/register-schema';
import { FormInput } from '@/shared/components/form';
import { registerUser } from '../model/server/register-user';

interface Props {
  className?: string;
  setOpen: (open: boolean) => void;
}

export const RegisterForm: React.FC<Props> = ({ setOpen }) => {
  const [submiting, setSubmiting] = React.useState(false);

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
      console.log(data);
      setSubmiting(true);
      await registerUser(data);
      toast.success('Аккаунт успешно создан!!!', { icon: '✅' });
      setOpen(false);
      setSubmiting(false);
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        setSubmiting(false);
        console.log('Error [REGISTER_FORM]', error);
        return toast.error(error.message, { icon: '❌' });
      }
    }
  };

  return (
    <FormProvider {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <FormInput
              label='Имя'
              name='firstName'
              id='firstName'
              type='text'
              placeholder='Имя'
              required
            />
          </div>
          <div className='space-y-2'>
            <FormInput
              label='Фамилия'
              name='lastName'
              id='lastName'
              type='text'
              placeholder='Фамилия'
              required
            />
          </div>
        </div>
        <div className='space-y-2 relative'>
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
        </div>
        {/* <PhoneInput /> */}
        <div className='space-y-2'>
          <FormInput label='Телефон' name='phone' id='phone' type='tel' required />
        </div>

        {/* Подписка */}
        {/* <div className='space-y-2'>
          <FormSubscriptionSelect required name='subscription' label='Выберите подписку' />
        </div> */}
        <div className='space-y-2'>
          <FormInput
            label='Логин'
            name='login'
            id='login'
            type='text'
            placeholder='Логин'
            required
          />
        </div>
        <div className='space-y-2'>
          <FormInput
            label='Пароль'
            name='password'
            id='password'
            type='password'
            placeholder='Введите пароль'
            required
          />
        </div>
        <div className='space-y-2'>
          <FormInput
            label='Повторите пароль'
            name='confirmPassword'
            id='confirmPassword'
            type='password'
            placeholder='Повторите пароль'
            required
          />
        </div>
        <Button className='w-full' type='submit' disabled={submiting}>
          {submiting ? 'Загрузка...' : 'Создать'}
        </Button>
      </form>
    </FormProvider>
  );
};
