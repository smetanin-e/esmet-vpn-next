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
import { CreatePeerForm } from './create-peer-form';
import { useUserSession } from '@/features/auth/model/hooks/use-session';

interface Props {
  className?: string;
}

export const CreatePeerModal: React.FC<Props> = () => {
  const [open, setOpen] = React.useState(false);
  const { user, isLoading } = useUserSession();

  return (
    <>
      {isLoading ? (
        <Button disabled size='sm'>
          Добавить конфигурацию
        </Button>
      ) : (
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <Button size='sm'>Добавить конфигурацию</Button>
          </DialogTrigger>
          <DialogContent className='min-w-sm  bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 '>
            <DialogHeader className='space-y-1'>
              <DialogTitle className='text-2xl font-bold text-center'>
                Создание конфигурации VPN
              </DialogTitle>
              <DialogDescription className='text-center'>
                Введите название своего файла конфигурации
              </DialogDescription>
            </DialogHeader>
            <CreatePeerForm setOpen={setOpen} userId={Number(user!.id)} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
