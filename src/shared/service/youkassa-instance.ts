import axios from 'axios';

export const youkassaInstance = axios.create({
  baseURL: 'https://api.yookassa.ru/v3/',
  headers: {
    'Content-Type': 'application/json',
    'Idempotence-Key': Math.random().toString(36).substring(7),
    Authorization: `Basic ${Buffer.from(
      `${process.env.YOOKASSA_ID}:${process.env.YOOKASSA_API_KEY}`,
    ).toString('base64')}`,
  },
});
