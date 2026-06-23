import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await prisma.user.findUnique({ where: { username: adminUsername } });
  if (existing) {
    console.log(`Seed skipped: user "${adminUsername}" already exists. No data was deleted.`);
    return;
  }

  const adminHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.create({
    data: {
      username: adminUsername,
      passwordHash: adminHash,
      name: 'Administrator',
      role: 'ADMIN',
    },
  });

  console.log(`Admin user created: ${adminUsername}`);
  console.log('Existing sites, workers, and transactions were not changed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
