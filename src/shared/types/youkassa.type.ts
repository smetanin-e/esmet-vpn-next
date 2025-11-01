//types/yookassa.ts
//Типизируем ответ от ЮКАССА

export interface PaymentData {
  id: string;
  status: string;
  amount: Amount;
  description: string;
  recipient: Recipient;
  created_at: string;
  confirmation: Confirmation;
  test: boolean;
  paid: boolean;
  refundable: boolean;
  metadata: Metadata;
  capture: boolean;
}

export interface Amount {
  value: string;
  currency: string;
}

export interface Recipient {
  account_id: string;
  gateway_id: string;
}

export interface Confirmation {
  type: string;
  confirmation_url: string;
}

export interface Metadata {
  transactionId: number;
}

// Callback от Юкассы
export interface PaymentCallbackData {
  type: string;
  event: string;
  object: {
    id: string;
    status: 'pending' | 'waiting_for_capture' | 'succeeded' | 'canceled';
    amount: { value: string; currency: 'RUB' };
    income_amount: { value: string; currency: 'RUB' };
    description: string;
    recipient: { account_id: string; gateway_id: string };
    payment_method: {
      type: string;
      id: string;
      saved: boolean;
      title: string;
    };
    captured_at: string | null;
    created_at: string;
    test: boolean;
    refunded_amount: { value: string; currency: 'RUB' };
    paid: boolean;
    refundable: boolean;
    metadata: { transactionId: string };
    authorization_details?: {
      rrn?: string;
      auth_code?: string;
    };
  };
}
