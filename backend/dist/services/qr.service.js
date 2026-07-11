"use strict";
// 4. AŞAMA - QR Kod Sistemi (ana modul)
//
// Akis:
// 1) Yeni demirbas olusturulur (Depo sorumlusu tarafindan)
// 2) Benzersiz UUID uretilir (asset ile 1-1 eslenir)
// 3) UUID'den QR gorseli uretilir (icine SADECE "asset/<uuid>" yazilir - guvenlik)
// 4) QRCodeRecord tablosuna kaydedilir
//
// Okutma akisi:
// Telefon QR okur -> UUID gelir -> GET /api/assets/qr/:uuid -> DB'de aranir -> bilgi doner
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQrForAsset = createQrForAsset;
exports.getAssetByUuid = getAssetByUuid;
exports.createAssetWithQr = createAssetWithQr;
exports.findAssetByQr = findAssetByQr;
const uuid_1 = require("uuid");
const database_1 = __importDefault(require("../config/database"));
const qrGenerator_1 = require("../utils/qrGenerator");
const audit_service_1 = require("./audit.service");
async function createQrForAsset(assetId) {
    const uuid = (0, uuid_1.v4)();
    const qrImagePath = await (0, qrGenerator_1.generateQrImage)(uuid);
    const qrRecord = await database_1.default.qRCodeRecord.create({
        data: {
            assetId,
            uuid,
            qrImagePath,
        },
    });
    return qrRecord;
}
async function getAssetByUuid(uuid) {
    const qrRecord = await database_1.default.qRCodeRecord.findUnique({
        where: { uuid },
        include: {
            asset: {
                include: {
                    category: true,
                    assignments: {
                        where: { status: 'ACTIVE' },
                        include: { user: { select: { id: true, name: true, email: true } } },
                    },
                },
            },
        },
    });
    if (!qrRecord) {
        const error = new Error('Bu QR koduna ait demirbaş bulunamadı');
        error.statusCode = 404;
        throw error;
    }
    return qrRecord.asset;
}
async function createAssetWithQr(data, performedByUserId, ipAddress) {
    // 1) Demirbasi olustur
    const asset = await database_1.default.asset.create({
        data: {
            name: data.name,
            categoryId: data.categoryId,
            purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
        },
    });
    // 2) QR kod uret ve iliskilendir
    const qrRecord = await createQrForAsset(asset.id);
    // 3) Audit log
    await (0, audit_service_1.createAuditLog)({
        userId: performedByUserId,
        action: 'CREATE_ASSET',
        entity: 'Asset',
        entityId: asset.id,
        ipAddress,
    });
    return { ...asset, qrCode: qrRecord };
}
async function findAssetByQr(uuid) {
    const record = await database_1.default.qRCodeRecord.findUnique({
        where: {
            uuid
        },
        include: {
            asset: {
                include: {
                    category: true,
                    assignments: {
                        where: {
                            status: "ACTIVE"
                        },
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    if (!record) {
        throw new Error("QR kaydı bulunamadı");
    }
    return record;
}
