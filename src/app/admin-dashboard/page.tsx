import { Clients } from '@/widgets/clients/ui/clients';
import { Header } from '@/shared/components/header';
import { Subscriptions } from '@/widgets/subscriptions/ui/subscriptions';
import { Transactions } from '@/widgets/transactions/ui/transactions';
import { Badge } from '@/shared/components/ui';
import { Peers } from '@/widgets/peers/ui';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { getUserSession } from '@/features/user/actions/get-user-session';

export default async function AdminDashboardPage() {
  const user = await getUserSession();
  if (!user) return redirect('/not-auth');
  if (user.role !== UserRole.ADMIN) return redirect('/dashboard');

  return (
    <div className=' min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
      <div className='container mx-auto py-4 px-2'>
        <Header title='Админ-панель' name={`${user.lastName} ${user.firstName}`} role={user.role} />
        <div className='space-y-8'>
          <Subscriptions />
          <div className=' lg:grid lg:grid-cols-[1fr_370px] lg:gap-6 '>
            <Clients className='mb-8 lg:mb-0' />
            <Transactions />
          </div>

          <Peers
            userRole={user.role}
            label={
              <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white'>
                Все конфигурации
              </Badge>
            }
          />
        </div>
      </div>
    </div>
  );
}
