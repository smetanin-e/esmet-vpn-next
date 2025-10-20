import { NextRequest } from 'next/server';

export function validateApiToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;

  const token = authHeader.split(' ')[1];
  return token === process.env.INTERNAL_API_TOKEN || token === process.env.NEXT_PUBLIC_API_READ_KEY;
}
