import { CleareButton } from '@/shared/components';
import { Input } from '@/shared/components/ui';
import React from 'react';

interface Props {
  className?: string;
  searchValue: string;
  setSearchValue: (text: string) => void;
}

export const SearchPeer: React.FC<Props> = ({ searchValue, setSearchValue }) => {
  return (
    <div className='w-xl relative'>
      <Input
        placeholder='Поиск по логину или имени клиента'
        className=''
        type='text'
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      {searchValue && <CleareButton onClick={() => setSearchValue('')} />}
    </div>
  );
};
