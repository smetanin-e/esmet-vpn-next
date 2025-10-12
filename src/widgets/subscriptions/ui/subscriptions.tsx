import React from 'react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui';
import { SubscriptionItem } from '@/entities/subscription/ui/subscription-item';

interface Props {
  className?: string;
}

export const Subscriptions: React.FC<Props> = () => {
  return (
    <Card className='bg-slate-800/50 border-blue-600 backdrop-blur-sm relative  max-w-full'>
      <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white'>
        Подписки
      </Badge>
      <CardHeader className='mb-0 pb-0 flex items-center justify-between'>
        <CardTitle>Подписки для пользователей</CardTitle>
        <Button size={'sm'} variant={'outline'}>
          Добавить
        </Button>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4 justify-center'>
          <SubscriptionItem />
          <SubscriptionItem />
          <SubscriptionItem />
        </div>
      </CardContent>
    </Card>
  );
};
