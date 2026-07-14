// Demirbas islemleri icin Zod validasyon semalari

import { z } from 'zod';

export const createAssetSchema = z.object({
  name: z.string().min(2, 'Demirbaş adı en az 2 karakter olmalı'),
  categoryId: z.number().int().positive('Geçerli bir kategori seçiniz'),
  purchaseDate: z.string().datetime().optional(),
});

export const updateAssetSchema = createAssetSchema.partial();

export type CreateAssetInput = z.infer<typeof createAssetSchema>;
export type UpdateAssetInput = z.infer<typeof updateAssetSchema>;
