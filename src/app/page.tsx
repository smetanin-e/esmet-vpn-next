import { LoginModal } from '@/features/auth/login';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
      <h1 className='text-4xl md:text-5xl font-bold mb-4 text-center'>
        Добро пожаловать в VPN-сервис
      </h1>

      <p className='text-l text-gray-300 mb-8 text-center max-w-xl p-2'>
        Безопасный доступ к интернету для ограниченного круга пользователей. Пожалуйста, войдите в
        систему, чтобы управлять своими настройками и конфигурациями WireGuard.
      </p>

      <LoginModal />

      <footer className='mt-20 text-gray-400 text-sm'>
        &copy; 2025 esmetVPN. Все права защищены.
      </footer>
    </div>
  );
}
