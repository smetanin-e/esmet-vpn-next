'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui';
import { SubscriptionItem } from '@/entities/subscription/ui/subscription-item';
import { SubscriptionModal } from '@/features/subscription/ui/subscription-modal';
import { useGetSubscriptions } from '@/entities/subscription/api/use-get-subscriptions';
import { CardLabel } from '@/shared/components';

interface Props {
  className?: string;
}

export const Subscriptions: React.FC<Props> = () => {
  const { data, isLoading } = useGetSubscriptions();
  return (
    <Card className='bg-slate-800/50 border-blue-600 backdrop-blur-sm relative  max-w-full'>
      <CardLabel text='Подписки' />

      <CardHeader className='mb-0 pb-0 flex items-center justify-between'>
        <CardTitle>Подписки для пользователей</CardTitle>
        <SubscriptionModal />
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 justify-center'>
          {isLoading ? (
            <div>Loading</div>
          ) : (
            <>
              {' '}
              {data?.map((subscription) => (
                <SubscriptionItem key={subscription.id} subscription={subscription} />
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
