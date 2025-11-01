import { PaymentFormType } from '@/features/transaction/model/payment-schema';
import { axiosInstance } from '@/shared/service/instance';

type TransactionResponse = string;

export const transactionApi = {
  async payment(value: PaymentFormType) {
    try {
      return (await axiosInstance.post<TransactionResponse>('/transaction', value)).data;
    } catch (error) {
      console.error('[transactionApi.payment] Ошибка при создании платежа:', error);
      throw error;
    }
  },
};
