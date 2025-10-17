'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/shared/components/ui';
import { FormInput } from '@/shared/components/form';
import { LoginFormType, loginSchema } from '@/shared/schemas/login-schema';

interface Props {
  className?: string;
}

export const LoginForm: React.FC<Props> = () => {
  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: '',
      password: '',
    },
  });
  const onSubmit = async (data: LoginFormType) => {
    try {
      console.log(data);
    } catch (error) {
      console.log('Error [LOGIN_FORM]', error);
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
