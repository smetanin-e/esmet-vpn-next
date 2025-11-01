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
import { PaymentForm } from './payment-form';

interface Props {
  className?: string;
}

export const PaymentModal: React.FC<Props> = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size='sm' variant={'outline'} className='px-8 py-4'>
          Пополнить
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-sm  bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 '>
        <DialogHeader className='space-y-1'>
          <DialogTitle className='text-2xl font-bold text-center'>Пополнение баланса</DialogTitle>
          <DialogDescription className='text-center'>
            Введите сумму для пополнения. Число должно быть целым
          </DialogDescription>
        </DialogHeader>
        <PaymentForm onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
