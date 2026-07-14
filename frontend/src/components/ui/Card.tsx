import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
  interactive?: boolean;
}

export function Card({ children, className = "", padded = true, interactive = false, ...rest }: CardProps) {
  return (
    <div
      className={`glass rounded-xl shadow-sm shadow-black/20 transition-all duration-200 ${
        padded ? "p-5" : ""
      } ${interactive ? "glass-hover hover:-translate-y-0.5 hover:scale-[1.01] cursor-default" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mb-4 flex items-center justify-between ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`font-display text-sm font-semibold text-ink-100 ${className}`}>{children}</h2>;
}
