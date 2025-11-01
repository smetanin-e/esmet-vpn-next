import { Transaction, TransactionType } from '@prisma/client';

export type TransactionDTO = Pick<
  Transaction,
  'type' | 'amount' | 'createdAt' | 'description' | 'status'
>;

export type TransactionTopUp = {
  userId: number;
  amount: number;
  type: TransactionType;
  description: string;
};
