import React from 'react';

import { Button } from '@/shared/components/ui';
import { CreatePeerDialog } from './create-peer-dialog';

interface Props {
  className?: string;
}

export const CreatedPeerTrigger: React.FC<Props> = () => {
  return (
    <>
      <CreatePeerDialog
        trigger={
          <Button size={'sm'} variant={'outline'}>
            Добавить
          </Button>
        }
      />
    </>
  );
};
