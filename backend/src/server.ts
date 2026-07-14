// Proje giriş noktası
// Görevi: env değişkenlerini yükle, app'i oluştur ve dinlemeye başla.
// Middleware/route tanımı burada YOK -> hepsi app.ts içinde.

import 'dotenv/config';
import { createApp } from './app';

const app = createApp();
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor -> http://localhost:${PORT}`);
});
