'use client';
import React from 'react';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui';
import { Laptop, Monitor, Smartphone } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { UserSubscription } from '@/entities/subscription/model/types';
import { calculatePrice } from '@/shared/lib/calculate-price';

interface Props {
  className?: string;
  subscription: UserSubscription;
  balance: number;
}

export const ClientSubscriptionCard: React.FC<Props> = ({ className, subscription, balance }) => {
  const prices = calculatePrice(subscription.dailyPrice, subscription.maxPeers);

  console.log(prices);
  return (
    <Card
      className={cn(
        'bg-slate-800/50 border-blue-600 backdrop-blur-sm relative max-w-full',
        className,
      )}
    >
      <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white'>
        Моя подписка
      </Badge>
      <CardHeader>
        <CardTitle className=' flex items-center justify-between'>
          <span className='text-lg'>{subscription.name}</span>
          <Badge variant={subscription.active ? 'success' : 'destructive'}>
            {subscription.active ? 'Активна' : 'Отключена'}
          </Badge>
        </CardTitle>
        <CardDescription className='text-slate-300'>
          <ul>
            <li className='flex items-center gap-2  text-lg'>
              <Smartphone className='h-4 w-4 text-green-400' />
              <Laptop className='h-4 w-4 text-green-400' />
              <Monitor className='h-4 w-4 text-green-400' />
              устройств - {subscription.maxPeers}
            </li>
            {prices.map((price, index) => (
              <li className='mt-2' key={index}>{`Активных стройств: ${
                index + 1
              } - списание ${price} ₽ в сутки`}</li>
            ))}
          </ul>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex space-x-12 items-center'>
          <p className='text-xl text-slate-400'>
            Баланс:{' '}
            <span className='text-2xs font-bold text-white'>{`₽ ${balance ? balance : 0}`}</span>
          </p>
          <Button variant={'outline'} size={'sm'}>
            Пополнить
          </Button>
        </div>
        {/* //TODO ПОСЧИТАТЬ ОСТАТОК ДНЕЙ */}
        <div className='mt-6  text-center'>Действие подписки</div>
        <p className=' text-center'>До 26.10.2025</p>
      </CardContent>
    </Card>
  );
};
