// Prisma Client tekil (singleton) baglantisi
// Butun servisler bu dosyadan "prisma" nesnesini import eder

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
