// Demirbas + QR islemleri controller'i

import { Request, Response, NextFunction } from 'express';
import * as qrService from '../services/qr.service';
import prisma from '../config/database';

export async function createAsset(req: Request, res: Response, next: NextFunction) {
  try {
    const performedByUserId = req.user!.id;
    const ipAddress = req.ip;
    
    const asset = await qrService.createAssetWithQr(req.body, performedByUserId, ipAddress);

    // [Audit Log]: Demirbaş ekleme işlemi loglanıyor
    await prisma.auditLog.create({
      data: {
        userId: performedByUserId,
        action: 'CREATE_ASSET',
        entity: 'Asset',
        entityId: asset.id,
        ipAddress: ipAddress
      }
    });

    res.status(201).json({ message: 'Demirbaş ve QR kod oluşturuldu', asset });
  } catch (error) {
    next(error);
  }
}

export async function listAssets(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        skip,
        take: limit,
        include: { category: true, qrCode: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.asset.count(),
    ]);

    res.status(200).json({ assets, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
}

export async function getAssetByQrUuid(req: Request, res: Response, next: NextFunction) {
  try {
    const { uuid } = req.params;
    const asset = await qrService.getAssetByUuid(uuid);
    res.status(200).json({ asset });
  } catch (error) {
    next(error);
  }
}

export async function updateAsset(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, serialNumber, status } = req.body;
    const performedByUserId = req.user!.id;
    const ipAddress = req.ip;

    const updatedAsset = await prisma.asset.update({
      where: { id: Number(id) },
      data: {
        ...(name && { name }),
        ...(serialNumber && { serialNumber }),
        ...(status && { status }),
      },
    });
    
    // [Audit Log]: Demirbaş güncelleme işlemi loglanıyor
    await prisma.auditLog.create({
      data: {
        userId: performedByUserId,
        action: 'UPDATE_ASSET',
        entity: 'Asset',
        entityId: updatedAsset.id,
        ipAddress: ipAddress
      }
    });

    res.status(200).json({ message: 'Demirbaş başarıyla güncellendi', asset: updatedAsset });
  } catch (error) {
    next(error);
  }
}

export async function deleteAsset(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const assetId = Number(id);
    const performedByUserId = req.user!.id;
    const ipAddress = req.ip;

    // 1. Kolon adı tam olarak "assetId" olduğu için çift tırnak içinde siliyoruz
    await prisma.$executeRaw`DELETE FROM "qr_code_records" WHERE "assetId" = ${assetId}`;

    // 2. Şimdi demirbaşın kendisini siliyoruz
    const deletedAsset = await prisma.asset.delete({
      where: { id: assetId },
    });

    // [Audit Log]: Demirbaş silme işlemi loglanıyor
    await prisma.auditLog.create({
      data: {
        userId: performedByUserId,
        action: 'DELETE_ASSET',
        entity: 'Asset',
        entityId: deletedAsset.id,
        ipAddress: ipAddress
      }
    });

    res.status(200).json({ message: 'Demirbaş ve bağlı QR kodu başarıyla silindi', asset: deletedAsset });
  } catch (error) {
    next(error);
  }
}