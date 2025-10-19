import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/lib/next-auth-options';
import { userRepository } from '@/entities/user/repository/user-repository';

export const getUserSession = async () => {
  const session = await getServerSession(authOptions);

  const sessionUser = session?.user;
  if (!sessionUser) return null;

  const user = await userRepository.findUserById(Number(sessionUser.id));

  if (!user || !user.status) return null;
  console.log({ session, user });
  return user;
};
