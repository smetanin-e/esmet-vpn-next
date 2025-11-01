import { transactionRepository } from '@/entities/transaction/repository/transactionprepisitory';
import { userRepository } from '@/entities/user/repository/user-repository';
import { verifyYookassaSignature } from '@/shared/lib/auth/verify-yookassa-signature';
import { PaymentCallbackData } from '@/shared/types/youkassa.type';
import { OrderStatus } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let rawBody = '';
  try {
    // Получаем сырое тело запроса ДО парсинга JSON
    rawBody = await req.text();

    // Получаем подпись из заголовков
    const authorizationHeader = req.headers.get('Authorization');

    if (!authorizationHeader || !authorizationHeader.startsWith('Signature ')) {
      console.error('Отсутствует или неверный заголовок Authorization');
      return NextResponse.json({ error: 'Unauthorized: Missing signature' }, { status: 401 });
    }

    // Извлекаем саму подпись
    const signature = authorizationHeader.replace('Signature ', '');

    // Проверяем подпись
    const isValidSignature = verifyYookassaSignature(rawBody, signature);

    if (!isValidSignature) {
      console.error('Неверная подпись от ЮКассы');
      return NextResponse.json({ error: 'Unauthorized: Invalid signature' }, { status: 401 });
    }

    console.log('✅ Подпись проверена успешно');
    //получаем запрос от Юкасса
    const body = JSON.parse(rawBody) as PaymentCallbackData;
    console.log('ПРИШЕЛ ОТВЕТ ОТ ЮКАССА', body);

    // Проверяем тип события
    if (body.type !== 'notification') {
      console.error('Неизвестный тип уведомления:', body.type);
      return NextResponse.json({ error: 'Unknown notification type' }, { status: 400 });
    }

    // Ищем транзакцию по transactionId
    if (!body.object.metadata?.transactionId) {
      console.error('Отсутствует transactionId в metadata');
      return NextResponse.json({ error: 'Missing transactionId' }, { status: 400 });
    }

    //Ищем транзакцию по transactionId, который пришел с ответом Юкассы
    const transaction = await transactionRepository.findById(
      Number(body.object.metadata.transactionId),
    );
    if (!transaction) {
      return NextResponse.json({ error: 'Транзакция не найдена' });
    }

    //Сохраняем ответ статуса транзакции
    const isSucceeded = body.object.status === 'succeeded';

    //обновляем статус транзакции
    const status = isSucceeded ? OrderStatus.SUCCEEDED : OrderStatus.CANCELED;
    await transactionRepository.updateAfterPayment(transaction.id, status, body.object.id);

    //Обновляем баланс пользователю
    if (isSucceeded) {
      const user = await userRepository.findUserById(transaction.userId);

      if (!user) {
        return NextResponse.json({ error: 'User not found' });
      }

      await userRepository.increaseBalance(user.id, transaction.amount);

      return new Response('OK', { status: 200 });
    }
  } catch (error) {
    console.log('[API_TRANSACTION_CALLBACK] Server error', error);
    return NextResponse.json({ error: 'Server error' });
  }
}
