import { SCANNER_STATUS_META } from "./qr-scanner.constants";
import type { ScannerStatus } from "./qr-scanner.constants";

interface ScannerOverlayProps {
  status: ScannerStatus;
}

export function ScannerOverlay({ status }: ScannerOverlayProps) {
  const meta = SCANNER_STATUS_META[status];
  const Icon = meta.icon;
  const showScanLine = status === "SCANNING" || status === "CAMERA_ACTIVE" || status === "CAMERA_LOADING";
  const showCorners = status !== "SUCCESS";

  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {showCorners && (
        <>
          <div className="scanner-corner absolute left-3 top-3 h-8 w-8 rounded-tl-xl" />
          <div className="scanner-corner absolute right-3 top-3 h-8 w-8 rounded-tr-xl" />
          <div className="scanner-corner absolute bottom-3 left-3 h-8 w-8 rounded-bl-xl" />
          <div className="scanner-corner absolute bottom-3 right-3 h-8 w-8 rounded-br-xl" />
        </>
      )}

      {showScanLine && (
        <div className="scan-line-wrapper absolute left-[12%] right-[12%]">
          <div className="scan-line" />
          <div className="scan-line-glow" />
        </div>
      )}

      <div className="absolute left-1/2 top-5 -translate-x-1/2">
        <div
          className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold backdrop-blur-md shadow-lg transition-all duration-300 ${meta.bgClass} ${meta.borderClass} ${meta.colorClass} ${meta.glowClass}`}
        >
          <Icon size={13} className={`${meta.spin ? "animate-spin" : ""} ${meta.pulse ? "animate-pulse" : ""}`} />
          {meta.label}
        </div>
      </div>

      {status === "SUCCESS" && (
        <div className="absolute inset-0 flex items-center justify-center bg-ok/10 animate-in fade-in zoom-in duration-300">
          <div className="success-ring grid h-24 w-24 place-items-center rounded-full border-2 border-ok/50 bg-night-950/90 shadow-[0_0_60px_-12px_rgba(52,211,153,0.6)]">
            <svg className="h-12 w-12 text-ok" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path className="check-stroke" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="absolute mt-36 text-sm font-semibold text-ok">Başarıyla Okundu</p>
        </div>
      )}
    </div>
  );
}
