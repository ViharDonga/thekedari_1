/**
 * DEV ONLY — deletes ALL data and recreates admin.
 * Never run this on production after you have real users/sites.
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_DB_WIPE !== 'true') {
    throw new Error('Refusing to wipe production database. Set ALLOW_DB_WIPE=true to override.');
  }

  await prisma.labourBooking.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.rentalMaterial.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.materialDelivery.deleteMany();
  await prisma.materialInventory.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.user.deleteMany();
  await prisma.constructionSite.deleteMany();

  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const adminHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.create({
    data: {
      username: adminUsername,
      passwordHash: adminHash,
      name: 'Administrator',
      role: 'ADMIN',
    },
  });

  console.log('Database wiped. Admin user recreated only.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
