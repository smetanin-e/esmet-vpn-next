import React from 'react';
import { Card, CardContent, CardDescription, CardTitle } from '@/shared/components/ui';
import { SubscriptionType } from '../model/types';

interface Props {
  className?: string;
  subscription: SubscriptionType;
}

export const SubscriptionItem: React.FC<Props> = ({ subscription }) => {
  return (
    <Card className='bg-slate-800/50 border-blue-600 backdrop-blur-sm relative max-w-full px-4 gap-2 '>
      <CardTitle>{subscription.name}</CardTitle>
      <CardDescription>{subscription.description}</CardDescription>
      <CardContent>
        <div>Абонентская плата {subscription.dailyPrice} р.</div>
        <div>Пиров: {subscription.maxPeers}</div>
      </CardContent>
    </Card>
  );
};
