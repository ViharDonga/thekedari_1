/**
 * Run once in Render Shell if admin login fails but admin user exists.
 * Example: npm run admin:reset-password
 */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient();
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    await prisma.user.create({
      data: {
        username,
        passwordHash,
        name: 'Administrator',
        role: 'ADMIN',
      },
    });
    console.log(`Created admin: ${username}`);
  } else {
    await prisma.user.update({
      where: { username },
      data: { passwordHash, role: 'ADMIN' },
    });
    console.log(`Reset password for admin: ${username}`);
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
