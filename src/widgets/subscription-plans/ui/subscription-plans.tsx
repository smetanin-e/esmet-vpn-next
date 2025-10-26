'use client';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui';

import { SubscriptionModal } from '@/features/subscription-plan/ui/subscription-plan-modal';

import { CardLabel } from '@/shared/components';
import { useGetSubscriptionPlans } from '@/entities/subscription-plan/api/use-get-subscriptions';
import { SubscriptionPlanItem } from '@/entities/subscription-plan/ui/subscription-plan-item';

interface Props {
  className?: string;
}

export const SubscriptionPlans: React.FC<Props> = () => {
  const { data, isLoading } = useGetSubscriptionPlans();
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
                <SubscriptionPlanItem key={subscription.id} subscription={subscription} />
              ))}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
