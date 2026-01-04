import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseStyles =
  "px-4 py-2 rounded-md font-medium transition inline-flex items-center justify-center focus:outline-none focus:ring-2";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-text-inverted border border-primary hover:bg-primary-hover focus:ring-primary/30",

  secondary:
    "bg-secondary text-text-inverted hover:bg-secondary-hover",

  outline:
    "border border-border text-text hover:bg-background-muted",

  danger:
    "bg-error text-text-inverted hover:opacity-90",
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
        disabled ? "opacity-50 cursor-not-allowed" : "",
        className ?? "",
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
