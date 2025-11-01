import { PaymentData } from '@/shared/types/youkassa.type';
import axios from 'axios';

interface Props {
  amount: number;
  transactionId: number;
  description: string;
}

export async function createPayment(details: Props): Promise<PaymentData> {
  //   const payload = {
  //     amount: {
  //       //указываем информацию - сколько нужно оплатить
  //       value: details.amount.toFixed(2),
  //       currency: 'RUB',
  //     },
  //     capture: true,
  //     description: details.description, //описание платежа
  //     metadata: {
  //       //эта информация будет возвращаться в момент платежа
  //       //чтобы мы понимали какой именно заказ обрабатывается
  //       transactionId: details.transactionId, //используем transactionId с нашей базы данных
  //     },
  //     confirmation: {
  //       type: 'redirect',
  //       confirmation_url: process.env.YOOKASSA_CALLBACK_URL!, //ссылка возврата на сайт после оплаты
  //     },
  //   };

  //   const { data } = await youkassaInstance.post('payments', payload);

  //   return data;

  const { data } = await axios.post<PaymentData>(
    //ссылка куда отправляем запрос
    'https://api.yookassa.ru/v3/payments',

    //передаем необходимую информацию в запрос
    {
      amount: {
        //указываем информацию - сколько нужно оплатить
        value: details.amount,
        currency: 'RUB',
      },
      capture: true,
      description: details.description, //описание платежа
      metadata: {
        //эта информация будет возвращаться в момент платежа
        //чтобы мы понимали какой именно заказ обрабатывается
        transactionId: details.transactionId, //используем transactionId с нашей базы данных
      },
      confirmation: {
        type: 'redirect',
        return_url: process.env.YOOKASSA_CALLBACK_URL, //ссылка возврата на сайт после оплаты
      },
    },

    //передаем авторизационную информацию и headers
    {
      auth: {
        username: process.env.YOOKASSA_ID as string,
        password: process.env.YOOKASSA_API_KEY as string,
      },
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': Math.random().toString(36).substring(7), //передаем случайный ключ, который будет уникализировать наш платеж
      },
    },
  );
  return data;
}
