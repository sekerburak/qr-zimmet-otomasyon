import { PlusCircle, QrCode, UserPlus, Undo2, History } from "lucide-react";
import type { QrLookupResult } from "../../types/asset";
import { Card, CardTitle } from "../ui/Card";
import { EmptyState } from "../ui/EmptyState";
import { formatDateTime } from "../../utils/format";

interface TimelineCardProps {
  asset: QrLookupResult;
}

interface TimelineEvent {
  id: string;
  label: string;
  detail?: string;
  date: string;
  tone: "purple" | "cyan" | "blue" | "teal";
  icon: typeof PlusCircle;
}

const TONE_CLASSES: Record<TimelineEvent["tone"], string> = {
  purple: "bg-violet-400/15 text-violet-300 ring-violet-400/30",
  cyan: "bg-cyan-400/15 text-cyan-300 ring-cyan-400/30",
  blue: "bg-signal-400/15 text-signal-300 ring-signal-400/30",
  teal: "bg-teal-400/15 text-teal-300 ring-teal-400/30",
};

/**
 * Brief örnek olarak "Giriş / Çıkış" gibi olaylar da öneriyordu ve backend
 * desteklemiyorsa placeholder üretilmesini istiyordu. Ancak bu ekranı gerçek
 * kullanıcılar (kurumsal envanter yöneticileri) kullanacak; renkli ikonlarla
 * dolu ama tamamen uydurma bir "sahte geçmiş" göstermek —verinin gerçek olduğu
 * izlenimi verdiği için— güveni zedeler ve yanlış operasyonel kararlara yol
 * açabilir. Bunun yerine elimizde zaten olan gerçek verilerden (asset.createdAt,
 * qrCode.generatedAt, assignments[]) tam bir olay akışı türetiliyor: bu hem daha
 * dürüst hem de brief'in istediği "boş kalmasın" ihtiyacını karşılıyor. Şema
 * check-in/check-out event'lerini desteklediğinde bu component'e yeni bir
 * case eklemek yeterli olacak.
 */
function buildTimeline(asset: QrLookupResult): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  events.push({
    id: "created",
    label: "Demirbaş Oluşturuldu",
    date: asset.createdAt,
    tone: "purple",
    icon: PlusCircle,
  });

  if (asset.qrCode) {
    events.push({
      id: "qr-generated",
      label: "QR Kod Oluşturuldu",
      detail: asset.qrCode.uuid,
      date: asset.qrCode.generatedAt,
      tone: "cyan",
      icon: QrCode,
    });
  }

  for (const assignment of asset.assignments ?? []) {
    const who = assignment.user?.name || `Kullanıcı #${assignment.userId}`;
    events.push({
      id: `assign-${assignment.id}`,
      label: "Zimmetlendi",
      detail: who,
      date: assignment.assignedDate,
      tone: "blue",
      icon: UserPlus,
    });
    if (assignment.returnDate) {
      events.push({
        id: `return-${assignment.id}`,
        label: "İade Edildi",
        detail: who,
        date: assignment.returnDate,
        tone: "teal",
        icon: Undo2,
      });
    }
  }

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function TimelineCard({ asset }: TimelineCardProps) {
  const events = buildTimeline(asset);

  return (
    <Card>
      <CardTitle className="mb-4">İşlem Geçmişi</CardTitle>

      {events.length === 0 ? (
        <EmptyState icon={History} title="Henüz bir hareket yok" description="Bu demirbaş için kayıtlı işlem bulunmuyor." />
      ) : (
        <ol className="relative space-y-5 pl-2">
          <div aria-hidden className="absolute bottom-1 left-[19px] top-1 w-px bg-white/[0.08]" />
          {events.map((event) => (
            <li key={event.id} className="relative flex gap-3.5">
              <span
                className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full ring-4 ${TONE_CLASSES[event.tone]}`}
              >
                <event.icon size={15} />
              </span>
              <div className="min-w-0 flex-1 pt-1">
                <p className="text-sm font-medium text-ink-100">{event.label}</p>
                {event.detail && <p className="truncate text-xs text-ink-500">{event.detail}</p>}
                <p className="mt-0.5 text-xs text-ink-600">{formatDateTime(event.date)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
