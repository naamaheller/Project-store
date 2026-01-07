import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "default";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseStyles =
  "px-4 py-2 rounded-md font-medium transition inline-flex items-center justify-center " +
  // focus (keyboard only)
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-text-inverted border border-primary hover:bg-primary-hover",

  secondary:
    "bg-secondary text-text-inverted hover:bg-secondary-hover",

  outline:
    "border border-border bg-white text-text hover:bg-background-muted hover:border-primary/50",

  danger:
    "bg-error text-text-inverted hover:opacity-90 focus-visible:ring-error/20",
  
  default:  
    "text-text hover:bg-default-hover",
};

export function Button({
  children,
  variant = "primary",
  disabled,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={[
        baseStyles,
        variantStyles[variant],
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
        className ?? "",
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
