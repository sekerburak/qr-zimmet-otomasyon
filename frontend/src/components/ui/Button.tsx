import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "border border-white/10 bg-white/5 text-ink-200 hover:border-signal-500/40 hover:bg-white/10",
  ghost: "text-ink-400 hover:bg-white/5 hover:text-ink-100",
  danger: "border border-danger/40 text-danger hover:bg-danger/10",
};

const SIZE_STYLES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, disabled, className = "", children, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${VARIANT_STYLES[variant]} ${SIZE_STYLES[size]} ${className}`}
        {...rest}
      >
        {loading && <Loader2 size={size === "sm" ? 13 : 15} className="animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
