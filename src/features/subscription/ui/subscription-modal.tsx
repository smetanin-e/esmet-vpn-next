'use client';
import React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui';
import { FormSubscription } from './subscription-form';
import { Plus } from 'lucide-react';

interface Props {
  className?: string;
}

export const SubscriptionModal: React.FC<Props> = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type='button' variant='outline' size='sm'>
          <Plus className='w-4 h-4' />
          Добавить подписку
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-sm  bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 '>
        <DialogHeader className='space-y-1'>
          <DialogTitle className='text-2xl font-bold text-center'>Создание подписки</DialogTitle>
          <DialogDescription className='text-center'>
            Добавление нового тарифного плана
          </DialogDescription>
        </DialogHeader>
        <FormSubscription setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
