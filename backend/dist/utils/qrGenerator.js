"use strict";
// QR kod gorseli uretme yardimcisi
// 4. AŞAMA - QR Kod Sistemi
// Onemli: QR icine SADECE uuid koyariz (orn: asset/7fa9-91ab-23cc)
// Urun adi, kullanici adi gibi hassas bilgi QR'a asla yazilmaz (guvenlik)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQrImage = generateQrImage;
const qrcode_1 = __importDefault(require("qrcode"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const QR_OUTPUT_DIR = path_1.default.join(__dirname, '..', '..', 'uploads', 'qr');
// uploads/qr klasoru yoksa olustur
if (!fs_1.default.existsSync(QR_OUTPUT_DIR)) {
    fs_1.default.mkdirSync(QR_OUTPUT_DIR, { recursive: true });
}
/**
 * Verilen uuid icin QR kod PNG dosyasi uretir.
 * QR icerigi: "asset/<uuid>"  (frontend bu path'i okuyup ilgili sayfaya yonlendirir)
 */
async function generateQrImage(uuid) {
    const qrContent = `asset/${uuid}`;
    const fileName = `${uuid}.png`;
    const filePath = path_1.default.join(QR_OUTPUT_DIR, fileName);
    await qrcode_1.default.toFile(filePath, qrContent, {
        errorCorrectionLevel: 'M',
        margin: 2,
        width: 300,
    });
    // Veritabanina kaydedilecek goreli yol
    return `/uploads/qr/${fileName}`;
}
