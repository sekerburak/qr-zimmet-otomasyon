"use strict";
// 2. AŞAMA - JWT Middleware
// Gelen her istekte "Authorization: Bearer <token>" basligini kontrol eder.
// Token yoksa veya gecersizse -> 401 Unauthorized
// Gecerliyse -> req.user'a kullanici bilgisini ekler ve devam eder (next())
//
// Not: req.user alaninin tipi src/types/express.d.ts dosyasinda tanimlidir.
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
const jwt_1 = require("../utils/jwt");
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token bulunamadı, giriş yapmalısınız' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded; // sonraki middleware/controller'lar req.user'i kullanabilir
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Token geçersiz veya süresi dolmuş' });
    }
}
