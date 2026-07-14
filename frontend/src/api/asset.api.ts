import { api } from "./axios";
import type { Asset, AssetListResponse } from "../types/asset";

export async function listAssets(page = 1, limit = 20): Promise<AssetListResponse> {
  const { data } = await api.get<AssetListResponse>("/assets", { params: { page, limit } });
  return data;
}

export interface CreateAssetInput {
  name: string;
  categoryId: number;
  purchaseDate?: string;
}

export async function createAsset(input: CreateAssetInput): Promise<{ message: string; asset: Asset }> {
  const { data } = await api.post("/assets", input);
  return data;
}
