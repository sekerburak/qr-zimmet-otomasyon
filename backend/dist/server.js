"use strict";
// Proje giriş noktası
// Görevi: env değişkenlerini yükle, app'i oluştur ve dinlemeye başla.
// Middleware/route tanımı burada YOK -> hepsi app.ts içinde.
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = require("./app");
const app = (0, app_1.createApp)();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor -> http://localhost:${PORT}`);
});
