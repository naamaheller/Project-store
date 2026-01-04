"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const baseStyles =
  "px-4 py-2 rounded-md font-medium transition inline-flex items-center justify-center " +
  "focus:outline-none focus:ring-2";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border border-primary text-text bg-transparent " +
    "hover:bg-primary-soft/80 focus:ring-primary-soft",
  secondary:
    "bg-secondary text-text-inverted hover:bg-secondary-hover focus:ring-secondary",

  outline:
    "border border-border text-text hover:bg-background-muted focus:ring-border",

  danger: "bg-error text-text-inverted hover:opacity-90 focus:ring-error",
};

export function Button({
  children,
  variant = "primary",
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = !!disabled;

  return (
    <button
      disabled={isDisabled}
      className={[
        baseStyles,
        variantStyles[variant],
        isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
        className ?? "",
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}
