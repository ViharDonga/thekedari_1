/**
 * Test PostgreSQL connection using DATABASE_URL from .env
 * Run: node scripts/test-db-connection.js
 */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SELECT current_user as user, current_database() as db`;
  console.log('Connection OK:', result);
}

main()
  .catch((err) => {
    console.error('Connection FAILED:', err.message);
    console.error('\nFix:');
    console.error('1. pgAdmin -> connect as postgres on port 5433');
    console.error('2. Run: ALTER USER vihar WITH PASSWORD \'vihar2203\';');
    console.error('3. Or set DATABASE_URL to use postgres user in backend/.env');
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
