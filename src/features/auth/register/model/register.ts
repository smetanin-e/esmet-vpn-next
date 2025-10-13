import { RegisterUserType } from '@/shared/schemas/register-user-schema';
import { registerUser } from '@/shared/services/auth/auth-service';

export async function registerFeature(data: RegisterUserType) {
  const user = await registerUser(data);
  return user;
}
