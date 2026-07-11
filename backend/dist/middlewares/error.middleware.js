"use strict";
// Merkezi hata yakalama middleware'i (en sona, tum route'lardan sonra eklenir)
// notFoundHandler: tanimsiz route'lara 404 doner (error.middleware ile ayni dosyada tutulur)
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
function notFoundHandler(req, res, next) {
    res.status(404).json({ message: `Route bulunamadı: ${req.method} ${req.originalUrl}` });
}
function errorHandler(err, req, res, next) {
    console.error('[HATA]', err);
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Sunucu hatası oluştu';
    res.status(statusCode).json({ message });
}
