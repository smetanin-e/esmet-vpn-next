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
import { calculatePrice } from '@/shared/lib/calculate-price';
import { CardLabel } from '@/shared/components';
import { UserSubscriptionDTO } from '@/entities/user-subscription/model/type';

interface Props {
  className?: string;
  subscription: UserSubscriptionDTO;
  balance: number;
}

export const ClientSubscriptionCard: React.FC<Props> = ({ className, subscription, balance }) => {
  const prices = calculatePrice(
    subscription.subscriptionPlan.dailyPrice,
    subscription.subscriptionPlan.maxPeers,
  );

  //   const subsEnd = subscription.endDate
  //     ? new Date(subscription.endDate).toLocaleDateString('ru-RU')
  //     : 'Дата не определена';

  console.log(prices);
  return (
    <Card
      className={cn(
        'bg-slate-800/50 border-blue-600 backdrop-blur-sm relative max-w-full',
        className,
      )}
    >
      <CardLabel text='Моя подписка' />

      <CardHeader>
        <CardTitle className=' flex items-center justify-between'>
          <span className='text-lg'>{subscription.subscriptionPlan.name}</span>
          <Badge variant={subscription.status ? 'success' : 'destructive'}>
            {subscription.status ? 'Активна' : 'Отключена'}
          </Badge>
        </CardTitle>
        <CardDescription className='text-slate-300'>
          <ul>
            <li className='flex items-center gap-2  text-lg'>
              <Smartphone className='h-4 w-4 text-green-400' />
              <Laptop className='h-4 w-4 text-green-400' />
              <Monitor className='h-4 w-4 text-green-400' />
              устройств - {subscription.subscriptionPlan.maxPeers}
            </li>
          </ul>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {subscription.subscriptionPlan.name === 'Бесплатная' ? (
          <></>
        ) : (
          <>
            <ul>
              {' '}
              {prices.map((price, index) => (
                <li className='mt-2 text-sm' key={index}>{`Активных стройств: ${
                  index + 1
                } - списание ${price} ₽ в сутки`}</li>
              ))}
            </ul>

            <div className='flex space-x-12 items-center mt-6'>
              <p className='text-xl text-slate-400'>
                Баланс:{' '}
                <span className='text-2xs font-bold text-white'>{`₽ ${
                  balance ? balance : 0
                }`}</span>
              </p>
              <Button variant={'outline'} size={'sm'}>
                Пополнить
              </Button>
            </div>
          </>
        )}

        {/* //TODO ПОСЧИТАТЬ ОСТАТОК ДНЕЙ */}
        {/* <div className='mt-6  text-center'>Действие подписки</div>
        <p className=' text-center'>До {subsEnd}</p> */}
      </CardContent>
    </Card>
  );
};
