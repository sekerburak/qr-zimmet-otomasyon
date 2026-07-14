// Merkezi hata yakalama middleware'i (en sona, tum route'lardan sonra eklenir)
// notFoundHandler: tanimsiz route'lara 404 doner (error.middleware ile ayni dosyada tutulur)

import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  res.status(404).json({ message: `Route bulunamadı: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('[HATA]', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Sunucu hatası oluştu';

  res.status(statusCode).json({ message });
}
