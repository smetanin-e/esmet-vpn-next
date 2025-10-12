'use client';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui';
import React from 'react';

interface Props {
  className?: string;
  trigger: React.ReactNode;
}

export const CreatePeerDialog: React.FC<Props> = ({ trigger }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='min-w-sm  bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 '>
        <DialogHeader className='space-y-1'>
          <DialogTitle className='text-2xl font-bold text-center'>
            <div className='flex items-center justify-center space-x-'>
              Создание конфигурации VPN
            </div>
          </DialogTitle>
          <DialogDescription className='text-center'>
            Введите название своего файла конфигурации. Например: vpn1
          </DialogDescription>
        </DialogHeader>
        <div className='flex items-center justify-center space-x-4'>
          <Button variant={'outline'} onClick={() => setOpen(false)}>
            Добавить
          </Button>
          <Button variant={'outline'} onClick={() => setOpen(false)}>
            Отмена
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
