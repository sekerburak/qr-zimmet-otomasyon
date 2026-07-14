// Express uygulamasinin kurulumu (middleware + route bağlama)
// server.ts bu app'i import edip sadece dinlemeye (listen) baslar.
// Bu ayrim sayesinde app, test dosyalarinda (supertest vb.) sunucuyu
// gercekten baslatmadan import edilip test edilebilir.

import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';

import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

export function createApp(): Application {
  const app = express();

  // ---- Güvenlik katmanı ----

  // Helmet: HTTP header güvenliği (XSS, clickjacking vb. temel korumalar)
  app.use(helmet());

  // CORS: sadece izin verilen frontend adresinden istek kabul et
 app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
       "http://localhost:5174"
    ],
    credentials: true,
  })
);

  // Rate limit: örn. 15 dakikada 100 istekten fazlasını engelle (brute-force login koruması)
  const limiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    message: { message: 'Çok fazla istek gönderildi, lütfen daha sonra tekrar deneyin' },
  });
  app.use('/api/', limiter);

  // ---- Genel middleware'ler ----
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Üretilen QR görsellerini statik olarak servis et
  app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

  // Basit sağlık kontrolü
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ---- Route'lar ----
  app.use('/api', routes);

  // ---- 404 (tanımsız route) ----
  app.use(notFoundHandler);

  // ---- Hata yakalama (en sonda olmalı) ----
  app.use(errorHandler);

  return app;
}
