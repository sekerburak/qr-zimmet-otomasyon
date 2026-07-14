import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface InfoItemProps {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  /** Değer kopyalanabilir bir kimlik ise (UUID, seri no vb.) mono font kullanılır. */
  mono?: boolean;
}

/**
 * Tekil "bilgi kartı". AssetInfoGrid içinde tablo satırı yerine kart görünümü
 * sağlamak için kullanılıyor — brief'te istenen "tablo gibi görünmesin" isteğinin
 * karşılığı. Hover'da hafif yükselme + border glow ile etkileşimli hissettirir.
 */
export function InfoItem({ icon: Icon, label, value, mono = false }: InfoItemProps) {
  return (
    <div className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-signal-500/30 hover:bg-white/[0.04] hover:shadow-[0_12px_28px_-14px_rgba(59,130,246,0.45)]">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-signal-500/10 text-signal-400 transition-colors duration-200 group-hover:bg-signal-500/15">
        <Icon size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-ink-500">{label}</p>
        <p className={`mt-0.5 truncate text-sm font-medium text-ink-100 ${mono ? "font-mono text-xs" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
