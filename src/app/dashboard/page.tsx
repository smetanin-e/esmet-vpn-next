import { ClientSubscriptionCard } from '@/widgets/clients/ui/client-subscription-card';
import { Header } from '@/shared/components/header';
import { Transactions } from '@/widgets/transactions/ui/transactions';
import { Badge, Card, CardContent } from '@/shared/components/ui';
import { Peers } from '@/widgets/peers/ui';
import { redirect } from 'next/navigation';
import { getUserSession } from '@/features/user/actions/get-user-session';
import { EmptyData } from '@/shared/components';
import { cn } from '@/shared/lib';

export default async function DashboardPage() {
  const user = await getUserSession();
  if (!user) return redirect('/not-auth');

  return (
    <div className=' min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
      <div className='container mx-auto py-4 px-2'>
        <Header
          title='Личный кабинет'
          name={`${user.lastName} ${user.firstName}`}
          role={user.role}
        />
        <div className='space-y-6 md:pt-4 md:grid md:grid-cols-[350px_1fr] md:grid-rows-2 md:gap-x-4 md:gap-y-4 md:w-full md:max-h-180 '>
          {user.subscription ? (
            <ClientSubscriptionCard
              className=' md:mb-0 md:col-start-1 md:row-start-1 '
              subscription={user.subscription}
              balance={user.balance}
            />
          ) : (
            <Card
              className={cn('bg-slate-800/50 border-blue-600 backdrop-blur-sm relative max-w-full')}
            >
              <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white'>
                Моя подписка
              </Badge>
              <CardContent>
                <EmptyData text='Подписка отсутствует' />
              </CardContent>
            </Card>
          )}

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
