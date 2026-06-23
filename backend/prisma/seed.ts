import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
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

  console.log('Live seed complete: admin user only.');
  console.log(`Login: ${adminUsername} / (password from ADMIN_PASSWORD env or default admin123)`);
  console.log('Create sites in app, then assign supervisor/labour users to sites.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
