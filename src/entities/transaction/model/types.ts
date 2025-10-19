import { Transaction } from '@prisma/client';

export type TransactionDTO = Pick<
  Transaction,
  'type' | 'amount' | 'createdAt' | 'description' | 'status'
>;
