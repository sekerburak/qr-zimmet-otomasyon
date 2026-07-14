import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-signal-500/20 px-6 py-16 text-center">
      <div className="grid h-11 w-11 place-items-center rounded-full bg-white/5 text-ink-500">
        <Icon size={20} />
      </div>
      <div>
        <p className="font-display text-sm font-semibold text-ink-200">{title}</p>
        {description && <p className="mx-auto mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
