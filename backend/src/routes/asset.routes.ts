// Demirbas + QR route tanimlari
// RBAC ornegi: sadece ADMIN ve DEPO yeni demirbas olusturabilir

import { Router } from 'express';
import * as assetController from '../controllers/asset.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';
import { validateRequest } from '../middlewares/validateRequest.middleware';
import { createAssetSchema } from '../validators/asset.validator';

const router = Router();

// GET /api/assets  -> giris yapmis herkes listeleyebilir
router.get('/', authMiddleware, assetController.listAssets);

// POST /api/assets -> sadece ADMIN ve DEPO olusturabilir
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['ADMIN', 'DEPO']),
  validateRequest(createAssetSchema),
  assetController.createAsset
);

// GET /api/assets/qr/:uuid -> QR okutunca calisan endpoint, giris sarti YOK
// (mobil kamera ile herkes okutup bilgi gorebilsin diye acik birakildi;
//  istenirse authMiddleware eklenerek kapali sisteme de cevrilebilir)
router.get('/qr/:uuid', assetController.getAssetByQrUuid);

// PUT /api/assets/:id -> Demirbas güncelleme (Sadece ADMIN ve DEPO rolleri güncelleyebilir)
router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'DEPO']),
  assetController.updateAsset
);

// DELETE /api/assets/:id -> Demirbas silme (Sadece ADMIN ve DEPO rolleri silebilir)
router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN', 'DEPO']),
  assetController.deleteAsset
);

export default router;