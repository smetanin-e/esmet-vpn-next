import { Button } from '@/shared/components/ui';
import { MoveLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NotAuthPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
      <h1 className='text-4xl md:text-5xl font-bold mb-4 text-center'>Доступ запрещен!</h1>

      <p className='text-l text-gray-300 mb-8 text-center max-w-xl p-2'>
        Данную страницу могут просматривать только авторизированные пользователи.
      </p>
      <Link href={'/'}>
        <Button>
          <MoveLeft className='w-4 h-4' />
          На главную
        </Button>
      </Link>

      <footer className='mt-20 text-gray-400 text-sm'>
        &copy; 2025 esmetVPN. Все права защищены.
      </footer>
    </div>
  );
}
