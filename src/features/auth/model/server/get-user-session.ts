import { getServerSession } from 'next-auth';
import { authOptions } from '../../lib/next-auth-options';
import { prisma } from '@/shared/lib';

export const getUserSession = async () => {
  const session = await getServerSession(authOptions);

  const sessionUser = session?.user;
  if (!sessionUser) return null;

  const user = await prisma.user.findUnique({
    where: { id: Number(sessionUser.id) },
    select: {
      firstName: true,
      lastName: true,
      role: true,
      login: true,
      balance: true,
      status: true,
      subscription: {
        select: {
          name: true,
          dailyPrice: true,
          description: true,
        },
      },
    },
  });

  if (!user || !user.status) return null;
  console.log({ session, user });
  return user;
};
