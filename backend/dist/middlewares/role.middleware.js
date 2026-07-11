"use strict";
// 3. AŞAMA - RBAC Yetki Sistemi
// Roller: ADMIN, DEPO, ZIMMET, PERSONEL
// Kullanim: router.delete('/assets/:id', authMiddleware, roleMiddleware(['ADMIN']), controller)
//
// Mantik:
// 1) auth.middleware'in req.user'a yazdigi rol okunur
// 2) izin verilen roller listesinde var mi bakilir
// 3) yoksa 403 Forbidden doner
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
function roleMiddleware(allowedRoles) {
    return (req, res, next) => {
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
