import { prisma } from '@/shared/lib/prisma';
import { TransactionTopUp } from '../model/types';
import { OrderStatus, TransactionType } from '@prisma/client';

export const transactionRepository = {
  async findById(id: number) {
    return prisma.transaction.findFirst({ where: { id } });
  },
  async createTopUp(data: TransactionTopUp) {
    return prisma.transaction.create({
      data: {
        userId: data.userId,
        description: data.description,
        type: TransactionType.TOP_UP,
        amount: data.amount,
      },
    });
  },

  async addPaymentUrl(id: number, paymentUrl: string) {
    return prisma.transaction.update({
      where: { id },
      data: {
        paymentUrl,
      },
    });
  },

  async updateAfterPayment(transactionId: number, status: OrderStatus, paymentId: string) {
    return prisma.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        status,
        paymentId: paymentId,
      },
    });
  },
};
