'use client';
import { downloadConfig } from '@/features/wg-peer/lib/download-config';
import { Button, Spinner } from '@/shared/components/ui';
import { Download } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

interface Props {
  peerId: number;
  peerName: string;
}

export const DownloadConf: React.FC<Props> = ({ peerId, peerName }) => {
  const [loading, setLoading] = React.useState(false);
  const download = async () => {
    try {
      setLoading(true);
      await downloadConfig(peerId, peerName);
    } catch (error) {
      console.error('Ошибка загрузки ❌', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка загрузке ❌');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button size={'icon'} variant='outline' onClick={download} disabled={loading}>
      {loading ? <Spinner className='w-4 h-4' /> : <Download className='w-4 h-4' />}
    </Button>
  );
};
