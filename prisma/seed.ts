import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      email: 'demo@local',
      name: 'Demo User'
    }
  });
  console.log('✅ Usuario demo creado (id = 1)');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
