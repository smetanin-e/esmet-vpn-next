import { AuthModal } from '@/features/auth-modal/ui/auth-modal';
import { getUserSession } from '@/features/user/actions/get-user-session';
import { Button } from '@/shared/components/ui';
import { LogIn } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function Home() {
  const user = await getUserSession();
  if (user) {
    return redirect('/dashboard');
  }
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
      <h1 className='text-4xl md:text-5xl font-bold mb-4 text-center'>
        Добро пожаловать в VPN-сервис
      </h1>

      <p className='text-l text-gray-300 mb-8 text-center max-w-xl p-2'>
        Безопасный доступ к интернету для ограниченного круга пользователей. Пожалуйста, войдите в
        систему, чтобы управлять своими настройками и конфигурациями WireGuard.
      </p>

      <AuthModal
        title='Добро пожаловать'
        description='Введите логин и пароль для входа в аккаунт'
        type='login'
        trigger={
          <Button>
            <LogIn className='w-4 h-4' />
            Войти
          </Button>
        }
      />

      <footer className='mt-20 text-gray-400 text-sm'>
        &copy; 2025 esmetVPN. Все права защищены.
      </footer>
    </div>
  );
}
