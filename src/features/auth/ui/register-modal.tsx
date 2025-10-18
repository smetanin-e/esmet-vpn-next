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
import { RegisterForm } from './register-form';

interface Props {
  className?: string;
}

export const RegisterUser: React.FC<Props> = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type='button' variant='outline' size='sm'>
          Создать пользователя
        </Button>
      </DialogTrigger>
      <DialogContent className='min-w-sm  bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 '>
        <DialogHeader className='space-y-1'>
          <DialogTitle className='text-2xl font-bold text-center'>
            Создание пользователя
          </DialogTitle>
          <DialogDescription className='text-center'>
            Добавление нового пользователя
          </DialogDescription>
        </DialogHeader>
        <RegisterForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
