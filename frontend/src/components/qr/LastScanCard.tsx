import { History, QrCode, ArrowRight } from "lucide-react";
import { Card, CardTitle } from "../ui/Card";
import { AssetStatusBadge } from "../StatusBadge";
import type { QrLookupResult } from "../../types/asset";
import { Link } from "react-router-dom";

interface LastScanCardProps {
  scan: QrLookupResult | null;
  scannedAt: Date | null;
  scannedUuid: string | null;
}

function formatScannedAt(date: Date): string {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  return isToday ? `Bugün ${time}` : date.toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}

function getStatusLabel(status: QrLookupResult["status"]): string {
  switch (status) {
    case "ASSIGNED":
      return "Zimmetli";
    case "ACTIVE":
      return "Depoda";
    case "PASSIVE":
      return "Pasif";
    default:
      return "Bilinmiyor";
  }
}

export function LastScanCard({ scan, scannedAt, scannedUuid }: LastScanCardProps) {
  return (
    <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01]">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg border border-signal-500/20 bg-signal-500/10 text-signal-400">
          <History size={17} />
        </div>
        <div>
          <CardTitle className="text-base">Son Okunan</CardTitle>
          <p className="text-xs text-ink-500">Son başarılı tarama kaydı</p>
        </div>
      </div>

      {scan ? (
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-base font-semibold text-ink-50 truncate">{scan.name}</p>
              <p className="text-xs text-ink-400">{scan.category?.name || "Kategorisiz"}</p>
            </div>
            <AssetStatusBadge status={scan.status} />
          </div>

          <div className="my-4 h-px bg-white/5" />

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-ink-500">Durum</p>
              <p className="mt-0.5 text-xs font-medium text-ink-200">{getStatusLabel(scan.status)}</p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2.5">
              <p className="text-[10px] uppercase tracking-wider text-ink-500">Tarama Zamanı</p>
              <p className="mt-0.5 text-xs font-medium text-ink-200">{scannedAt ? formatScannedAt(scannedAt) : "—"}</p>
            </div>
          </div>

          {scan.assignments?.some((a) => a.status === "ACTIVE") ? (
            <p className="mt-3 text-xs text-ink-400">
              Şu an{" "}
              <span className="font-medium text-ink-200">
                {scan.assignments.find((a) => a.status === "ACTIVE")?.user?.name || "kullanıcı"}
              </span>{" "}
              üzerinde zimmetli.
            </p>
          ) : (
            <p className="mt-3 text-xs text-ink-500">Şu an kimseye zimmetli değil.</p>
          )}

          {scannedUuid && (
            <Link
              to={`/assets/${scannedUuid}`}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-ink-200 transition-all duration-200 hover:scale-[1.02] hover:border-signal-500/30 hover:bg-white/10 hover:text-ink-100"
            >
              Detayları Gör
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-5 py-10">
          <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/5 text-ink-500">
            <QrCode size={28} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-ink-300">Henüz tarama yapılmadı</p>
            <p className="mt-1 max-w-[220px] text-xs text-ink-500">
              Başarılı ilk taramadan sonra burada son okutulan demirbaş görüntülenecek.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
