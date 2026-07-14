// Demirbas + QR islemleri controller'i

import { Request, Response, NextFunction } from 'express';
import * as qrService from '../services/qr.service';
import prisma from '../config/database';

export async function createAsset(req: Request, res: Response, next: NextFunction) {
  try {
    const performedByUserId = req.user!.id;
    const ipAddress = req.ip;
    const asset = await qrService.createAssetWithQr(req.body, performedByUserId, ipAddress);
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
