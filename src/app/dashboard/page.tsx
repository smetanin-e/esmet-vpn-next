import { ClientSubscriptionCard } from '@/widgets/clients/ui/client-subscription-card';
import { Header } from '@/shared/components/header';
import { Transactions } from '@/widgets/transactions/ui/transactions';

import { Badge } from '@/shared/components/ui';
import { Peers } from '@/widgets/peers/ui';
import { getUserSession } from '@/features/auth/model/server/get-user-session';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';

export default async function DashboardPage() {
  const user = await getUserSession();

  if (!user) {
    return redirect('/not-auth');
  }

  if (user.role === UserRole.ADMIN) {
    return redirect('/admin-dashboard');
  }

  console.log({ user });

  return (
    <div className=' min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
      <div className='container mx-auto py-4 px-2'>
        {/* шапка */}
        <Header title='Личный кабинет' />
        <div className='space-y-6 md:pt-4 md:grid md:grid-cols-[350px_1fr] md:grid-rows-2 md:gap-x-4 gap-y-8 md:w-full md:max-h-180 '>
          <ClientSubscriptionCard className=' md:mb-0 md:col-start-1 md:row-start-1' />
          <Peers
            className=' md:mb-0 md:col-start-2 md:row-span-2'
            label={
              <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white'>
                Мои конфигурации
              </Badge>
            }
          />
          <Transactions className=' md:col-start-1 md:row-start-2' />
        </div>
      </div>
    </div>
  );
}
