'use client';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui';
import { FormInput } from '@/shared/components/form';
import { LoginFormType, loginSchema } from '@/shared/schemas/login-schema';
import toast from 'react-hot-toast';
import { signIn } from 'next-auth/react';

interface Props {
  className?: string;
  onClose?: () => void;
}

export const LoginForm: React.FC<Props> = ({ onClose }) => {
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });
  const onSubmit = async (data: LoginFormType) => {
    try {
      const res = await signIn('credentials', {
        ...data,
        callbackUrl: '/dashboard',
      });

      if (res?.error) {
        return toast.error(res.error); // покажет текст из throw new Error('...')
      }

      //закрыть модалку
      onClose?.();
      toast.success('Добро пожаловать!');
    } catch (error) {
      console.error('Error [LOGIN]', error);
      return toast.error(error instanceof Error ? error.message : 'Не удалось войти в аккаунт ❌');
    }
  };
  return (
    <FormProvider {...form}>
      <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
        <div className='space-y-2'>
          <FormInput
            label='Логин'
            name='login'
            id='login'
            type='text'
            placeholder='Логин...'
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

        <Button disabled={form.formState.isSubmitting} className='w-full' type='submit'>
          Войти
        </Button>
      </form>
    </FormProvider>
  );
};
