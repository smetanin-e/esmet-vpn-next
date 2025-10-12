import { Clients } from '@/widgets/clients/ui/clients';
import { Header } from '@/shared/components/header';

import { Subscriptions } from '@/widgets/subscriptions/ui/subscriptions';
import { Transactions } from '@/widgets/transactions/ui/transactions';
import { Badge, Input } from '@/shared/components/ui';
import { Peers } from '@/widgets/peers/ui';

export default function DashboardPage() {
  return (
    <div className=' min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900'>
      <div className='container mx-auto py-4 px-2'>
        <Header title='Админ-панель' />
        <div className='space-y-8'>
          <Subscriptions />
          <div className=' md:grid md:grid-cols-[1fr_370px] md:gap-6 '>
            <Clients className='mb-8 md:mb-0' />
            <Transactions />
          </div>

          <Peers
            client='Сметанин Евгений'
            action={<Input className='max-w-2xs' placeholder='Поиск...' />}
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
