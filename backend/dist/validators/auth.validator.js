"use strict";
// 7. AŞAMA - Validation (Zod ile giris verisi dogrulama)
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'İsim en az 2 karakter olmalı'),
    email: zod_1.z.string().email('Geçerli bir email adresi giriniz'),
    password: zod_1.z.string().min(6, 'Şifre en az 6 karakter olmalı'),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Geçerli bir email adresi giriniz'),
    password: zod_1.z.string().min(1, 'Şifre boş olamaz'),
});
