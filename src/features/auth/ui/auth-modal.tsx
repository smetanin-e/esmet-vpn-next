'use client';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui';

import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

interface Props {
  className?: string;
  title: string;
  description: string;
  type: 'login' | 'register';
  trigger: React.ReactNode;
}

export const AuthModal: React.FC<Props> = ({ title, description, type, trigger }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='min-w-sm  bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 '>
        <DialogHeader className='space-y-1'>
          <DialogTitle className='text-2xl font-bold text-center'>{title}</DialogTitle>
          <DialogDescription className='text-center'>{description}</DialogDescription>
        </DialogHeader>
        {type === 'login' ? (
          <LoginForm onClose={() => setOpen(false)} />
        ) : (
          <RegisterForm onClose={() => setOpen(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
};
