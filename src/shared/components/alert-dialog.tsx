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
} from './ui';

import { TriangleAlert } from 'lucide-react';

interface Props {
  className?: string;
  trigger: React.ReactNode;
}

export const AlertDialog: React.FC<Props> = ({ trigger }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='min-w-sm  bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 '>
        <DialogHeader className='space-y-1'>
          <DialogTitle className='text-2xl font-bold text-center'>
            <div className='flex items-center justify-center space-x-4 text-orange-500'>
              <TriangleAlert className='w-6 h-6' />
              <span>Внимание!</span>
            </div>
          </DialogTitle>
          <DialogDescription className='text-center'>
            Вы действительно хотите что-то сделать?
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center justify-center space-x-4'>
          <Button variant={'outline'} onClick={() => setOpen(false)}>
            Подтвердить
          </Button>
          <Button variant={'outline'} onClick={() => setOpen(false)}>
            Отмена
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
