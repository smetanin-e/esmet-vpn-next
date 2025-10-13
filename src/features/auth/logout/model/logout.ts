// Фича инкапсулирует бизнес-логику — она не знает,
// где именно хранится сессия и как она удаляется.

import { logoutUser } from '@/shared/services/auth/auth-service';

export async function logoutFeature(userId: number) {
  await logoutUser(userId);
  return { success: true };
}
