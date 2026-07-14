// 3. AŞAMA - RBAC Yetki Sistemi
// Roller: ADMIN, DEPO, ZIMMET, PERSONEL
// Kullanim: router.delete('/assets/:id', authMiddleware, roleMiddleware(['ADMIN']), controller)
//
// Mantik:
// 1) auth.middleware'in req.user'a yazdigi rol okunur
// 2) izin verilen roller listesinde var mi bakilir
// 3) yoksa 403 Forbidden doner

import { Request, Response, NextFunction } from 'express';

export function roleMiddleware(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ message: 'Kullanıcı doğrulanmamış' });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: 'Bu işlem için yetkiniz yok',
        requiredRoles: allowedRoles,
        yourRole: userRole,
      });
    }

    next();
  };
}
