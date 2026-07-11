const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  await prisma.user.update({ where: { email: "yusuf@test.com" }, data: { passwordHash: hash } });
  await prisma.user.update({ where: { email: "admin@test.com" }, data: { role: "ADMIN" } });
  const users = await prisma.user.findMany({ select: { id: true, email: true, role: true } });
  console.log(JSON.stringify(users));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
