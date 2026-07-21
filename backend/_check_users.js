const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'yusuf@test.com' },
    update: {
      passwordHash: hash,
    },
    create: {
      email: 'yusuf@test.com',
      passwordHash: hash,
      name: 'Yusuf Admin',
      role: 'ADMIN',
    },
  });

  console.log('✅ KULLANICI BAŞARIYLA EKLENDİ / GÜNCELLENDİ:');
  console.log('Email:', user.email);
}

main()
  .catch((e) => {
    console.error('❌ HATA:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });