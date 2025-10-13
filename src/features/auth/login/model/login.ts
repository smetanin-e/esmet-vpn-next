import { updateUserDetails } from '@/entities/user/model/update-user-details';
import { loginUser } from '@/shared/services/auth/auth-service';

export async function loginFeature(login: string, password: string) {
  const { user, accessToken, refreshToken } = await loginUser(login, password);
  await updateUserDetails(user.id);
  return { user, accessToken, refreshToken };
}
