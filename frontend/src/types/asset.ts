import type { User } from "./user";

export type AssetStatus = "ACTIVE" | "PASSIVE" | "ASSIGNED";
export type AssignmentStatus = "ACTIVE" | "RETURNED";

export interface Category {
  id: number;
  name: string;
  parentCategoryId: number | null;
}

export interface QRCodeRecord {
  id: number;
  assetId: number;
  uuid: string;
  qrImagePath: string | null;
  generatedAt: string;
}

export interface Assignment {
  id: number;
  assetId: number;
  userId: number;
  assignedDate: string;
  returnDate: string | null;
  status: AssignmentStatus;
  user?: Pick<User, "id" | "name" | "email">;
}

export interface Asset {
  id: number;
  name: string;
  categoryId: number;
  category?: Category;
  status: AssetStatus;
  purchaseDate: string | null;
  createdAt: string;
  qrCode?: QRCodeRecord | null;
}

export interface AssetListResponse {
  assets: Asset[];
  total: number;
  page: number;
  totalPages: number;
}

/** GET /api/qr/:uuid dönüşü — asset + o an aktif olan zimmet(ler) */
export interface QrLookupResult extends Asset {
  assignments: Assignment[];
}
