import { Card, CardTitle } from "../ui/Card";
import { SCANNER_STATUS_META, ScannerState } from "./qr-scanner.constants";
import type { ScannerStatus } from "./qr-scanner.constants";

interface StatusPanelProps {
  status: ScannerStatus;
}

const STATUS_ORDER: ScannerStatus[] = [
  ScannerState.CAMERA_ACTIVE,
  ScannerState.SCANNING,
  ScannerState.SUCCESS,
  ScannerState.ERROR,
];

export function StatusPanel({ status }: StatusPanelProps) {
  const meta = SCANNER_STATUS_META[status];
  const Icon = meta.icon;

  function isStepReached(step: ScannerStatus): boolean {
    if (status === ScannerState.SUCCESS || status === ScannerState.ERROR) {
      return true;
    }
    const currentIndex = STATUS_ORDER.indexOf(status);
    const stepIndex = STATUS_ORDER.indexOf(step);
    if (currentIndex === -1) return false;
    return stepIndex <= currentIndex;
  }

  return (
    <Card className="h-full transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.01]">
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`grid h-9 w-9 place-items-center rounded-lg border transition-all duration-300 ${meta.borderClass} ${meta.bgClass} ${meta.colorClass} ${meta.glowClass}`}
        >
          <Icon size={17} className={`${meta.spin ? "animate-spin" : ""} ${meta.pulse ? "animate-pulse" : ""}`} />
        </div>
        <div>
          <CardTitle className="text-base">Tarama Durumu</CardTitle>
          <p className="text-xs text-ink-500">{meta.description}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-medium text-ink-400">Aktif Durum</span>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.bgClass} ${meta.colorClass} border ${meta.borderClass}`}
          >
            {meta.label}
          </span>
        </div>

        <div className="space-y-2">
          {STATUS_ORDER.map((step) => {
            const m = SCANNER_STATUS_META[step];
            const reached = isStepReached(step);
            const active = status === step;
            const StepIcon = m.icon;
            return (
              <div
                key={step}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-200 ${
                  active
                    ? `border-signal-500/30 bg-signal-500/10 status-row-active ${m.glowClass}`
                    : reached
                    ? "border-white/10 bg-white/[0.03]"
                    : "border-white/5 bg-transparent opacity-60"
                }`}
              >
                <div
                  className={`grid h-7 w-7 place-items-center rounded-lg border transition-colors ${
                    active
                      ? `${m.borderClass} ${m.bgClass}`
                      : reached
                      ? "border-ok/20 bg-ok/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <StepIcon
                    size={14}
                    className={`transition-colors ${active ? m.colorClass : reached ? "text-ok" : "text-ink-600"}`}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${active ? "text-ink-100" : reached ? "text-ink-200" : "text-ink-500"}`}>
                    {m.title}
                  </p>
                  <p className="text-[11px] text-ink-500">{m.description}</p>
                </div>
                {reached && !active && (
                  <div className="grid h-5 w-5 place-items-center rounded-full bg-ok/15">
                    <svg className="h-3 w-3 text-ok" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
