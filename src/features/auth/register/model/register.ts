import { RegisterUserType } from '@/shared/schemas/register-user-schema';
import { authService } from '@/shared/services/auth/auth-service';

export async function registerFeature(data: RegisterUserType) {
  const user = await authService.registerUser(data);
  return user;
}
