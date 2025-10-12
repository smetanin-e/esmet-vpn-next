import { updateUserDetails } from '@/entities/user/model/update-user-details';
import { loginUser } from '@/shared/services/auth/auth-service';
import { generateAccessToken } from '@/shared/services/auth/token-service';

export async function loginFeature(login: string, password: string) {
  const { user, refreshToken } = await loginUser(login, password);
  const accessToken = generateAccessToken({ userId: user.id, role: user.role });
  await updateUserDetails(user.id);
  return { user, accessToken, refreshToken };
}
