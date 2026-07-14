import { Tag, Hash, QrCode, CalendarClock, ShoppingCart, Folder } from "lucide-react";
import type { QrLookupResult } from "../../types/asset";
import { Card, CardTitle } from "../ui/Card";
import { InfoItem } from "./InfoItem";
import { formatDate } from "../../utils/format";

interface AssetInfoGridProps {
  asset: QrLookupResult;
}

/**
 * Brief; Marka / Model / Seri No alanlarını da istiyordu. types/asset.ts içindeki
 * Asset modelinde bu alanlar tanımlı değil (yalnızca id, name, categoryId, status,
 * purchaseDate, createdAt, qrCode var). Bu alanları arayüzde göstermek, olmayan
 * veriyi varmış gibi sunmak anlamına gelirdi — kural 12 zaten backend/şemayı
 * değiştirmeyi yasaklıyor. Bunun yerine gerçekten var olan tüm alanlar (kategori,
 * asset ID, satın alma tarihi, oluşturulma tarihi, QR UUID) kart olarak gösteriliyor.
 * Şema genişletildiğinde (marka/model/seri no eklendiğinde) tek yapılması gereken
 * bu diziye yeni bir InfoItem eklemek — component zaten buna göre tasarlandı.
 */
export function AssetInfoGrid({ asset }: AssetInfoGridProps) {
  return (
    <Card>
      <CardTitle className="mb-4">Demirbaş Bilgileri</CardTitle>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoItem icon={Folder} label="Kategori" value={asset.category?.name || "Kategorisiz"} />
        <InfoItem icon={Hash} label="Asset ID" value={`#${String(asset.id).padStart(6, "0")}`} mono />
        <InfoItem
          icon={ShoppingCart}
          label="Satın Alma Tarihi"
          value={asset.purchaseDate ? formatDate(asset.purchaseDate) : "Belirtilmemiş"}
        />
        <InfoItem icon={CalendarClock} label="Oluşturulma Tarihi" value={formatDate(asset.createdAt)} />
        {asset.qrCode && (
          <InfoItem icon={QrCode} label="QR UUID" value={asset.qrCode.uuid} mono />
        )}
        <InfoItem icon={Tag} label="Durum Kodu" value={asset.status} mono />
      </div>
    </Card>
  );
}
