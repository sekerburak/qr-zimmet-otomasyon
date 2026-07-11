"use strict";
// Express uygulamasinin kurulumu (middleware + route bağlama)
// server.ts bu app'i import edip sadece dinlemeye (listen) baslar.
// Bu ayrim sayesinde app, test dosyalarinda (supertest vb.) sunucuyu
// gercekten baslatmadan import edilip test edilebilir.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
function createApp() {
    const app = (0, express_1.default)();
    // ---- Güvenlik katmanı ----
    // Helmet: HTTP header güvenliği (XSS, clickjacking vb. temel korumalar)
    app.use((0, helmet_1.default)());
    // CORS: sadece izin verilen frontend adresinden istek kabul et
    app.use((0, cors_1.default)({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:5174"
        ],
        credentials: true,
    }));
    // Rate limit: örn. 15 dakikada 100 istekten fazlasını engelle (brute-force login koruması)
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
        max: Number(process.env.RATE_LIMIT_MAX) || 100,
        message: { message: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin' },
    });
    app.use('/api/', limiter);
    // ---- Genel middleware'ler ----
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Üretilen QR görsellerini statik olarak servis et
    app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', 'uploads')));
    // Basit sağlık kontrolü
    app.get('/health', (req, res) => {
        res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    // ---- Route'lar ----
    app.use('/api', routes_1.default);
    // ---- 404 (tanımsız route) ----
    app.use(error_middleware_1.notFoundHandler);
    // ---- Hata yakalama (en sonda olmalı) ----
    app.use(error_middleware_1.errorHandler);
    return app;
}
