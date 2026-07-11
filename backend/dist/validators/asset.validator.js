"use strict";
// Demirbas islemleri icin Zod validasyon semalari
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAssetSchema = exports.createAssetSchema = void 0;
const zod_1 = require("zod");
exports.createAssetSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Demirbaş adı en az 2 karakter olmalı'),
    categoryId: zod_1.z.number().int().positive('Geçerli bir kategori seçiniz'),
    purchaseDate: zod_1.z.string().datetime().optional(),
});
exports.updateAssetSchema = exports.createAssetSchema.partial();
