import { Fingerprint, QrCode, CalendarPlus, Copy, Check } from "lucide-react";
import { useState } from "react";
import type { QrLookupResult } from "../../types/asset";
import { AssetStatusBadge } from "../StatusBadge";
import { resolveAssetIcon } from "./assetIcon";
import { formatDate } from "../../utils/format";
import { ActionDropdown } from "./ActionDropdown";

interface AssetHeaderProps {
  asset: QrLookupResult;
  uuid: string;
}

/**
 * Sayfanın "hero" bölümü. Brief'te istenen "Son Güncelleme" alanı bilinçli olarak
 * eklenmedi: Asset tipinde updatedAt/lastModified alanı yok, backend'i değiştirmeden
 * bu bilgi üretilemez (kural 12). Var olmayan bir alanı sahte biçimde göstermek,
 * kurumsal bir üründe güven kaybettirir — bu yüzden yalnızca gerçekten var olan
 * "Eklenme Tarihi" (createdAt) gösteriliyor.
 */
export function AssetHeader({ asset, uuid }: AssetHeaderProps) {
  const [copied, setCopied] = useState(false);
  const Icon = resolveAssetIcon(asset.category?.name);

  function copyUuid() {
    navigator.clipboard.writeText(uuid).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className="glass fade-up relative overflow-hidden rounded-2xl p-6 sm:p-7">
      {/* Üst köşede yumuşak glow — brief'teki "premium hissettirsin" isteği için */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-signal-500/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 -bottom-24 h-56 w-56 rounded-full bg-beacon-500/10 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Sol: kimlik bloğu */}
        <div className="flex items-start gap-4">
          <div className="ring-glow grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-signal-500/25 to-beacon-500/10 text-signal-300">
            <Icon size={26} />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-50">{asset.name}</h1>
              <AssetStatusBadge status={asset.status} />
            </div>
            <p className="mt-1 text-sm text-ink-400">{asset.category?.name || "Kategorisiz"}</p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-ink-500">
              <Fingerprint size={13} />
              <span className="font-mono">Demirbaş #{String(asset.id).padStart(6, "0")}</span>
            </div>
          </div>
        </div>

        {/* Sağ: QR rozeti + meta + aksiyon menüsü */}
        <div className="flex items-start gap-3 self-stretch">
          <div className="glass-hover flex min-w-[220px] flex-col gap-2.5 rounded-xl border border-white/[0.06] px-4 py-3.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-signal-400">
                <QrCode size={13} /> QR UUID
              </span>
              <button
                onClick={copyUuid}
                className="rounded-md p-1 text-ink-500 transition-colors duration-200 hover:text-ink-100"
                title="UUID'yi kopyala"
              >
                {copied ? <Check size={13} className="text-ok" /> : <Copy size={13} />}
              </button>
            </div>
            <p className="truncate font-mono text-xs text-ink-200">{uuid}</p>
            <div className="flex items-center gap-1.5 border-t border-white/[0.06] pt-2.5 text-xs text-ink-500">
              <CalendarPlus size={13} />
              <span>Eklendi: {formatDate(asset.createdAt)}</span>
            </div>
          </div>

          <ActionDropdown />
        </div>
      </div>
    </div>
  );
}
