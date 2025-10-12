import React from 'react';
import { Card, CardContent, CardDescription, CardTitle } from '../../../shared/components/ui';

interface Props {
  className?: string;
}

export const SubscriptionItem: React.FC<Props> = () => {
  return (
    <Card className='bg-slate-800/50 border-blue-600 backdrop-blur-sm relative max-w-full px-4 gap-2'>
      <CardTitle>Стандартная</CardTitle>
      <CardDescription>Информация о подписке</CardDescription>
      <CardContent>
        <div>Абонентская плата 10 р.</div>
        <div>Пиров: 12</div>
      </CardContent>
    </Card>
  );
};
