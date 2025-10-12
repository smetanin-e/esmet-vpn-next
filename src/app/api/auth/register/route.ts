import { registerFeature } from '@/features/auth/register';
import { registerUserSchema } from '@/shared/schemas/register-user-schema';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerUserSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Невалидные данные' }, { status: 400 });
    }

    const user = await registerFeature(parsed.data);

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('[API_AUTH_REGISTER] Ошибка при регистрации:', error);
    const message = error instanceof Error ? error.message : 'Ошибка при регистрации';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
