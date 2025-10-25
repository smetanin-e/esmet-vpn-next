'use client';
import React from 'react';

import { QrCode } from 'lucide-react';
import Image from 'next/image';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Spinner,
} from '@/shared/components/ui';
import { showQrCode } from '@/features/wg-peer/lib/show-qr';
import toast from 'react-hot-toast';

interface Props {
  peerId: number;
  peerName: string;
}

export const Qr: React.FC<Props> = ({ peerId, peerName }: Props) => {
  const [qrUrl, setQrUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const fetchQr = async () => {
    try {
      setLoading(true);
      const url = await showQrCode(peerId);
      if (!url) {
        throw new Error('Не удалось загрузить QR-code');
      }
      setQrUrl(url);
    } catch (error) {
      console.error('Ошибка при загрузке QR:', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка при загрузке QR ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'icon'} variant='outline' onClick={fetchQr} disabled={loading}>
          {loading ? <Spinner className='w-4 h-4' /> : <QrCode className='w-4 h-4' />}
        </Button>
      </DialogTrigger>

      <DialogContent className='min-w-sm  bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 '>
        <DialogHeader>
          <DialogTitle>QR-код для {peerName}</DialogTitle>
        </DialogHeader>

        {qrUrl ? (
          <div className='flex flex-col items-center gap-3'>
            <Image
              src={qrUrl}
              alt={`QR для ${peerName}`}
              width={250}
              height={250}
              className='rounded-lg border shadow-md'
            />
            <p className='text-sm text-muted-foreground text-center'>
              Отсканируй этот QR-код в приложении WireGuard
            </p>
          </div>
        ) : (
          <p className='text-center text-sm text-muted-foreground'>Загрузка QR-кода...</p>
        )}
      </DialogContent>
    </Dialog>
  );
};
