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

import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';
import { generateQrImage } from '../utils/qrGenerator';
import { createAuditLog } from './audit.service';

export async function createQrForAsset(assetId: number) {
  const uuid = uuidv4();
  const qrImagePath = await generateQrImage(uuid);

  const qrRecord = await prisma.qRCodeRecord.create({
    data: {
      assetId,
      uuid,
      qrImagePath,
    },
  });

  return qrRecord;
}

export async function getAssetByUuid(uuid: string) {
  const qrRecord = await prisma.qRCodeRecord.findUnique({
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
    const error: any = new Error('Bu QR koduna ait demirbaş bulunamadı');
    error.statusCode = 404;
    throw error;
  }

  return qrRecord.asset;
}

export async function createAssetWithQr(
  data: { name: string; categoryId: number; purchaseDate?: string },
  performedByUserId: number,
  ipAddress?: string
) {
  // 1) Demirbasi olustur
  const asset = await prisma.asset.create({
    data: {
      name: data.name,
      categoryId: data.categoryId,
      purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
    },
  });

  // 2) QR kod uret ve iliskilendir
  const qrRecord = await createQrForAsset(asset.id);

  // 3) Audit log
  await createAuditLog({
    userId: performedByUserId,
    action: 'CREATE_ASSET',
    entity: 'Asset',
    entityId: asset.id,
    ipAddress,
  });

  return { ...asset, qrCode: qrRecord };
}

export async function findAssetByQr(uuid:string){

 const record = await prisma.qRCodeRecord.findUnique({

 where:{
    uuid
 },

 include:{
    asset:{
        include:{
            category:true,

            assignments:{
                where:{
                    status:"ACTIVE"
                },
                include:{
                    user:{
                        select:{
                            id:true,
                            name:true,
                            email:true
                        }
                    }
                }
            }
        }
    }
 }

 });


 if(!record){
    throw new Error("QR kaydı bulunamadı");
 }


 return record;

}