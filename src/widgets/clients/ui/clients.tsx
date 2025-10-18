import React from 'react';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui';
import { ClientItem } from '@/entities/user/ui/client-item';
import { cn } from '@/shared/lib/utils';
import { RegisterUser } from '@/features/auth/ui/register-modal';
import { AuthModal } from '@/features/auth';
import { Plus } from 'lucide-react';

interface Props {
  className?: string;
}

export const Clients: React.FC<Props> = ({ className }) => {
  return (
    <Card
      className={cn(
        'bg-slate-800/50 border-blue-600 backdrop-blur-sm relative  max-w-full gap-4',
        className,
      )}
    >
      <Badge className='absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white'>
        Клиенты
      </Badge>
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
        <ClientItem />
        <ClientItem />
      </CardContent>
    </Card>
  );
};
