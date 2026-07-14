import { useEffect, useRef, useState } from "react";
import { MoreVertical, Pencil, Trash2, Printer, RefreshCcw, FileDown, Lock } from "lucide-react";

interface MenuAction {
  key: string;
  label: string;
  icon: typeof Pencil;
  danger?: boolean;
  /** Şu anki API yüzeyinde karşılığı yoksa true — kural 12 gereği yeni endpoint eklenmedi. */
  unsupported?: boolean;
  onSelect?: () => void;
}

/**
 * Brief; Düzenle / Sil / QR Yazdır / QR Yenile / PDF Oluştur aksiyonlarını istiyor.
 * Ancak api/asset.api.ts ve api/qr.api.ts içinde update/delete/regenerate/export-pdf
 * endpoint'leri yok. Kural 12 "backend'e endpoint ekleme" dediği için bu aksiyonları
 * sessizce kaldırmak yerine — kurumsal ürünlerde daha sağlıklı bir pattern olan
 * "görünür ama kilitli + nedeni açık" yaklaşımını seçtim: kullanıcı özelliğin var
 * olduğunu bilir, tıkladığında neden çalışmadığını anlar. Sessizce gizlemek,
 * kullanıcıya "böyle bir özellik hiç yok" izlenimi verir ki bu yanlış bir sinyal.
 */
export function ActionDropdown() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actions: MenuAction[] = [
    { key: "edit", label: "Düzenle", icon: Pencil, unsupported: true },
    {
      key: "print",
      label: "QR Yazdır",
      icon: Printer,
      onSelect: () => {
        // QRCodeCard, #qr-print-area dışındaki her şeyi @media print ile gizliyor.
        window.print();
      },
    },
    { key: "regen", label: "QR Yenile", icon: RefreshCcw, unsupported: true },
    { key: "pdf", label: "PDF Oluştur", icon: FileDown, unsupported: true },
    { key: "delete", label: "Sil", icon: Trash2, danger: true, unsupported: true },
  ];

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Demirbaş aksiyonları"
        aria-haspopup="menu"
        aria-expanded={open}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10 bg-white/[0.03] text-ink-400 transition-all duration-200 hover:border-signal-500/40 hover:bg-white/[0.06] hover:text-ink-100"
      >
        <MoreVertical size={17} />
      </button>

      {open && (
        <div
          role="menu"
          className="glass-strong fade-up absolute right-0 top-12 z-20 w-56 overflow-hidden rounded-xl border border-white/10 py-1.5 shadow-2xl shadow-black/40"
        >
          {actions.map((action) => (
            <button
              key={action.key}
              role="menuitem"
              disabled={action.unsupported}
              title={action.unsupported ? "Bu aksiyon için backend desteği henüz yok" : undefined}
              onClick={() => {
                if (action.unsupported) return;
                action.onSelect?.();
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm transition-colors duration-150 ${
                action.unsupported
                  ? "cursor-not-allowed text-ink-600"
                  : action.danger
                    ? "text-danger hover:bg-danger/10"
                    : "text-ink-200 hover:bg-white/[0.06] hover:text-ink-50"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <action.icon size={15} />
                {action.label}
              </span>
              {action.unsupported && <Lock size={12} className="text-ink-700" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
