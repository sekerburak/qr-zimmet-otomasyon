import {
  Laptop,
  Monitor,
  Printer,
  Smartphone,
  Server,
  Projector,
  Keyboard,
  Router,
  Package,
  type LucideIcon,
} from "lucide-react";

/**
 * Orijinal brief her demirbaş için sabit "laptop ikonu" istiyordu, ancak bu ürün
 * sadece bilgisayarları değil tüm demirbaş kategorilerini yönetiyor (Categories
 * sayfası mevcut). Kategori adına göre ikon seçmek, tek bir sabit ikondan çok
 * daha güvenilir ve profesyonel bir envanter deneyimi sağlıyor (Intune/Lansweeter
 * tarzı ürünlerin hepsi kategoriye göre ikon kullanır). Eşleşme bulunamazsa nötr
 * bir kutu ikonuna düşer.
 */
const KEYWORD_ICON_MAP: Array<[RegExp, LucideIcon]> = [
  [/laptop|notebook|dizüstü|bilgisayar/i, Laptop],
  [/monitör|monitor|ekran/i, Monitor],
  [/yazıcı|printer/i, Printer],
  [/telefon|phone|tablet/i, Smartphone],
  [/sunucu|server/i, Server],
  [/projeks/i, Projector],
  [/klavye|mouse|keyboard/i, Keyboard],
  [/router|switch|modem|ağ/i, Router],
];

export function resolveAssetIcon(categoryName?: string | null): LucideIcon {
  if (!categoryName) return Package;
  const match = KEYWORD_ICON_MAP.find(([pattern]) => pattern.test(categoryName));
  return match ? match[1] : Package;
}
