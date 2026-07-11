"use strict";
// Prisma Client tekil (singleton) baglantisi
// Butun servisler bu dosyadan "prisma" nesnesini import eder
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
exports.default = prisma;
