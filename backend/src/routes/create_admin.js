const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  
  // Şemadaki zorunlu 'name' alanını da ekledik
  const user = await prisma.user.create({
    data: {
      name: "Admin Kullanıcı",
      email: "admin@test.com",
      passwordHash: hash,
      role: "ADMIN"
    }
  });
  
  console.log("İŞLEM BAŞARILI! Admin kullanıcısı oluşturuldu:", user.email);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("Hata çıktı:", e.message);
    process.exit(1);
  });