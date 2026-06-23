const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await prisma.user.findUnique({ where: { username } });

  if (existing) {
    console.log(`Admin "${username}" already exists. Login with ADMIN_PASSWORD from Render env (default admin123).`);
    await prisma.$disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      username,
      passwordHash,
      name: 'Administrator',
      role: 'ADMIN',
    },
  });

  console.log(`Admin user created: ${username}`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Admin bootstrap failed:', error);
  process.exit(1);
});
