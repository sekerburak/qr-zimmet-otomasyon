// 2. AŞAMA - JWT Middleware
// Gelen her istekte "Authorization: Bearer <token>" basligini kontrol eder.
// Token yoksa veya gecersizse -> 401 Unauthorized
// Gecerliyse -> req.user'a kullanici bilgisini ekler ve devam eder (next())
//
// Not: req.user alaninin tipi src/types/express.d.ts dosyasinda tanimlidir.

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token bulunamadı, giriş yapmalısınız' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // sonraki middleware/controller'lar req.user'i kullanabilir
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token geçersiz veya süresi dolmuş' });
  }
}
