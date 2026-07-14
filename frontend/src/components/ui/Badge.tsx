import type { ReactNode } from "react";

export type BadgeTone = "ok" | "info" | "warn" | "danger" | "neutral" | "signal";

const TONE_STYLES: Record<BadgeTone, string> = {
  ok: "bg-ok/15 text-ok border-ok/30",
  info: "bg-info/15 text-info border-info/30",
  warn: "bg-warn/15 text-warn border-warn/30",
  danger: "bg-danger/15 text-danger border-danger/30",
  neutral: "bg-ink-600/20 text-ink-400 border-ink-600/40",
  signal: "bg-signal-500/15 text-signal-400 border-signal-500/30",
};

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  dot?: boolean;
  className?: string;
}

export function Badge({ tone = "neutral", children, dot = false, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${TONE_STYLES[tone]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
