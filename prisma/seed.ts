import { generateSalt, hashPassword } from '@/shared/lib/auth';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function generateData() {
  const user = {
    login: 'Admin',
    telegram: 'https://t.me/esmet91',
    password: 'Mkoks2010',
    firstName: 'Admin',
    lastName: 'Admin',
    phone: '+79493492491',
    role: UserRole.ADMIN,
  };

  const salt = generateSalt();
  const hashedPassword = await hashPassword(user.password, salt);

  await prisma.user.create({
    data: {
      login: user.login,
      telegram: user.telegram,
      password: hashedPassword,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      role: user.role as UserRole,
      salt,
    },
  });
}
console.log('seed success');

async function clearData() {
  await prisma.$executeRaw`TRUNCATE TABLE "User" RESTART IDENTITY CASCADE`;
}

async function main() {
  try {
    await clearData();
    await generateData();
  } catch (error) {
    console.log(error);
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
