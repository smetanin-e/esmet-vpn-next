import React from 'react';
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui';
import { CircleDollarSign, CreditCard } from 'lucide-react';
import { EmptyData, ShowMore } from '@/shared/components';

import { cn } from '@/shared/lib/utils';
import { TransactionItem } from '@/entities/transaction/ui';

interface Props {
  className?: string;
}

export const Transactions: React.FC<Props> = ({ className }) => {
  return (
    <Card
      className={cn('bg-slate-800/50 border-slate-700 backdrop-blur-sm pb-1 relative', className)}
    >
      <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white'>
        Tранзакции
      </Badge>
      <CardHeader>
        <CardTitle className='text-white'>Транзакции</CardTitle>
        <CardDescription className='text-slate-300'>
          Фиксация пополнений и ежедневных списаний
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* <EmptyData text='Нет транзакций' /> */}
        <div className='space-y-4 overflow-y-scroll h-full md:h-[180px]'>
          <TransactionItem icon={<CreditCard className='h-4 w-4 text-green-400' />} />
          <TransactionItem icon={<CircleDollarSign className='h-4 w-4 text-red-400' />} />
          <TransactionItem icon={<CreditCard className='h-4 w-4 text-green-400' />} />
          <TransactionItem icon={<CircleDollarSign className='h-4 w-4 text-red-400' />} />
          <TransactionItem icon={<CreditCard className='h-4 w-4 text-green-400' />} />
          <TransactionItem icon={<CircleDollarSign className='h-4 w-4 text-red-400' />} />
          <TransactionItem icon={<CreditCard className='h-4 w-4 text-green-400' />} />
          <TransactionItem icon={<CircleDollarSign className='h-4 w-4 text-red-400' />} />
        </div>
        <ShowMore />
      </CardContent>
    </Card>
  );
};
