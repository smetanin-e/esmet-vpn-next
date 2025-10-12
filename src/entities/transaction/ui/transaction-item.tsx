import React from 'react';

interface Props {
  className?: string;
  icon: React.ReactNode;
  type?: any; //TODO ДОБАВИТЬ ТИП ТРАНЗАКЦИИ ИЗ PRISMA (пополнение/списание)
}

export const TransactionItem: React.FC<Props> = ({ icon, type }) => {
  return (
    <div className='flex items-start gap-3'>
      {icon}
      <div className='flex-1'>
        <div className='text-sm text-white'>Пополнение счета в размере - 150 ₽</div>
        <div className='text-xs text-slate-400'>15.10.2025 - 00.00.00 </div>
      </div>
    </div>
  );
};
