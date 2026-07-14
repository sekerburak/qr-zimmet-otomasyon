import { Badge } from "./ui/Badge";
import type { AssetStatus, AssignmentStatus } from "../types/asset";

// NOT: Backend şu an yalnızca ACTIVE / ASSIGNED / PASSIVE durumlarını destekliyor.
// Orijinal brief'te istenen "Bakımda" (turuncu) rozeti şemada karşılığı olmayan bir
// durum olduğu için eklenmedi — var olmayan bir state'i UI'da göstermek, kullanıcıyı
// gerçekte tetiklenemeyecek bir aksiyon bekletir. Kurumsal ürünlerde pasif/hurda
// demirbaşlar genelde kırmızı ile işaretlenir (Intune, Jamf), bu yüzden PASSIVE
// tonu "neutral" yerine "danger" yapıldı — sadece görsel bir iyileştirme, API/iş
// mantığına dokunulmadı.
const ASSET_TONE: Record<AssetStatus, "ok" | "info" | "danger"> = {
  ACTIVE: "ok",
  ASSIGNED: "info",
  PASSIVE: "danger",
};

const ASSET_LABELS: Record<AssetStatus, string> = {
  ACTIVE: "Depoda",
  ASSIGNED: "Zimmetli",
  PASSIVE: "Pasif",
};

const ASSIGNMENT_TONE: Record<AssignmentStatus, "info" | "neutral"> = {
  ACTIVE: "info",
  RETURNED: "neutral",
};

const ASSIGNMENT_LABELS: Record<AssignmentStatus, string> = {
  ACTIVE: "Zimmette",
  RETURNED: "İade Edildi",
};

export function AssetStatusBadge({ status }: { status: AssetStatus }) {
  return (
    <Badge tone={ASSET_TONE[status]} dot>
      {ASSET_LABELS[status]}
    </Badge>
  );
}

export function AssignmentStatusBadge({ status }: { status: AssignmentStatus }) {
  return (
    <Badge tone={ASSIGNMENT_TONE[status]} dot>
      {ASSIGNMENT_LABELS[status]}
    </Badge>
  );
}
