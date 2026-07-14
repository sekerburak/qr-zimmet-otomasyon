// QR kod gorseli uretme yardimcisi
// 4. AŞAMA - QR Kod Sistemi
// Onemli: QR icine SADECE uuid koyariz (orn: asset/7fa9-91ab-23cc)
// Urun adi, kullanici adi gibi hassas bilgi QR'a asla yazilmaz (guvenlik)

import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

const QR_OUTPUT_DIR = path.join(__dirname, '..', '..', 'uploads', 'qr');

// uploads/qr klasoru yoksa olustur
if (!fs.existsSync(QR_OUTPUT_DIR)) {
  fs.mkdirSync(QR_OUTPUT_DIR, { recursive: true });
}

/**
 * Verilen uuid icin QR kod PNG dosyasi uretir.
 * QR icerigi: "asset/<uuid>"  (frontend bu path'i okuyup ilgili sayfaya yonlendirir)
 */
export async function generateQrImage(uuid: string): Promise<string> {
  const qrContent = `asset/${uuid}`;
  const fileName = `${uuid}.png`;
  const filePath = path.join(QR_OUTPUT_DIR, fileName);

  await QRCode.toFile(filePath, qrContent, {
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 300,
  });

  // Veritabanina kaydedilecek goreli yol
  return `/uploads/qr/${fileName}`;
}
