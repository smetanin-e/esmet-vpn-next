'use client';
import React from 'react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui';
import { ClientItem } from '@/entities/user/ui/client-item';
import { cn } from '@/shared/lib/utils';

import { Plus } from 'lucide-react';
import { useGetUsers } from '@/entities/user/api/use-get-users';
import { AuthModal } from '@/features/auth-modal/ui/auth-modal';
import { CardLabel } from '@/shared/components';

interface Props {
  className?: string;
}

export const Clients: React.FC<Props> = ({ className }) => {
  const { data, isLoading } = useGetUsers();
  return (
    <Card
      className={cn(
        'bg-slate-800/50 border-blue-600 backdrop-blur-sm relative  max-w-full gap-4',
        className,
      )}
    >
      <CardLabel text='Клиенты' />
      <CardHeader className='mb-0 pb-0 flex items-center justify-between space-x-2 text-sm'>
        <CardTitle>Мои клиенты</CardTitle>

        <AuthModal
          title='Создание пользователя'
          description='Добавление нового пользователя'
          type='register'
          trigger={
            <Button type='button' variant='outline' size='sm'>
              <Plus className='w-4 h-4' />
              Создать пользователя
            </Button>
          }
        />
      </CardHeader>
      <CardContent className='space-y-2'>
        {isLoading ? (
          <div>Загрузка</div>
        ) : (
          data?.map((user) => <ClientItem key={user.id} user={user} />)
        )}
      </CardContent>
    </Card>
  );
};
