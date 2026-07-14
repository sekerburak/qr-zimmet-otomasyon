import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Printer, Download, RefreshCcw, Fingerprint, CalendarClock, BadgeCheck } from "lucide-react";
import type { QRCodeRecord } from "../../types/asset";
import { Card, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { formatDate } from "../../utils/format";

interface QRCodeCardProps {
  qrCode: QRCodeRecord | null | undefined;
  uuid: string;
  assetName: string;
}

/**
 * Brief "Son Tarama" ve "Tarama Sayısı" alanlarını da istiyordu. QRCodeRecord
 * tipinde (types/asset.ts) tarama sayacı/son tarama zamanı tutulmuyor — bu bir
 * analytics/event-log özelliği ve backend'de karşılığı yok (kural 12). Bunun
 * yerine gerçekten var olan "Oluşturulma Tarihi" gösteriliyor; "Durum" alanı ise
 * kayıttan türetiliyor (qrCode nesnesi var = geçerli/aktif demektir), uydurma bir
 * veri değil.
 *
 * QR görseli backend'in ürettiği qrImagePath yerine bilinçli olarak qrcode.react
 * ile istemci tarafında, doğrudan UUID'den üretiliyor. Neden: qrImagePath'in
 * nereden servis edildiği (statik dosya sunucusu, CDN, vs.) net değil ve bu
 * belirsizliğe bağlı kalmak "resim yüklenemedi" riskini bu kritik ekrana taşır.
 * İstemci tarafı üretim; her zaman keskin/vektörel render eder, anında indirilip
 * yazdırılabilir ve backend'e hiç bağımlı değildir.
 */
export function QRCodeCard({ qrCode, uuid, assetName }: QRCodeCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  function handleDownload() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `qr-${uuid}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function handlePrint() {
    window.print();
  }

  return (
    <Card>
      <CardTitle className="mb-4">QR Kartı</CardTitle>

      {/* #qr-print-area: index.css'teki @media print kuralı sadece bu bloğu görünür bırakır. */}
      <div id="qr-print-area" className="flex flex-col items-center">
        <div className="ring-glow rounded-2xl bg-white p-5">
          <QRCodeCanvas ref={canvasRef} value={uuid} size={188} level="Q" marginSize={0} />
        </div>
        <p className="qr-print-label mt-3 hidden text-center text-sm font-semibold text-black">{assetName}</p>

        <div className="mt-5 grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
            <Fingerprint size={14} className="shrink-0 text-signal-400" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-ink-500">QR UUID</p>
              <p className="truncate font-mono text-xs text-ink-200">{uuid}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
            <CalendarClock size={14} className="shrink-0 text-signal-400" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-ink-500">Oluşturma Tarihi</p>
              <p className="truncate text-xs text-ink-200">{qrCode ? formatDate(qrCode.generatedAt) : "—"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 sm:col-span-2">
            <BadgeCheck size={14} className="shrink-0 text-ok" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-ink-500">Durum</p>
              <p className="truncate text-xs text-ink-200">{qrCode ? "Geçerli" : "Kayıt bulunamadı"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="qr-actions mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Button variant="secondary" onClick={handlePrint}>
          <Printer size={14} /> Yazdır
        </Button>
        <Button variant="secondary" onClick={handleDownload}>
          <Download size={14} /> İndir
        </Button>
        <Button variant="ghost" disabled title="Bu aksiyon için backend desteği henüz yok" className="border border-white/10">
          <RefreshCcw size={14} /> Yeniden Oluştur
        </Button>
      </div>
    </Card>
  );
}
