import crypto from 'crypto';

// Функция для проверки подписи согласно документации ЮКассы
export function verifyYookassaSignature(rawBody: string, signature: string): boolean {
  try {
    // Создаем HMAC-SHA256 подпись из rawBody + secret_key
    const expectedSignature = crypto
      .createHmac('sha256', process.env.YOOKASSA_SECRET_KEY!)
      .update(rawBody)
      .digest('base64'); // ЮКасса использует base64 кодирование

    // Сравниваем подписи (используем безопасное сравнение)
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'base64'),
      Buffer.from(expectedSignature, 'base64'),
    );
  } catch (error) {
    console.error('Ошибка при проверке подписи:', error);
    return false;
  }
}
