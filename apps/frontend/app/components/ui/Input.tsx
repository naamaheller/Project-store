"use client";

import type { InputHTMLAttributes } from "react";

type InputProps = {
    label?: string;
    error?: string;
    helperText?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({
    label,
    error,
    helperText,
    disabled,
    className,
    id,
    ...props
}: InputProps) {
    const inputId = id ?? props.name;

    return (
        <div className="flex w-full flex-col gap-1">
            {label && (
                <label htmlFor={inputId} className="text-sm font-medium text-text">
                    {label}
                </label>
            )}

            <input
                id={inputId}
                disabled={disabled}
                className={[
                    // base
                    "w-full rounded-md px-3 py-2 text-base transition",
                    "bg-background text-text placeholder:text-text-muted",

                    // border
                    "border-2 border-primary/40",

                    // focus (keyboard only)
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                    "focus-visible:ring-offset-2 focus-visible:ring-offset-background",

                    // states
                    error &&
                    "border-error focus-visible:border-error focus-visible:ring-error/20",
                    disabled && "opacity-50 cursor-not-allowed bg-background-muted",

                    className ?? "",
                ]
                    .filter(Boolean)
                    .join(" ")}
                {...props}
            />

            {error ? (
                <p className="text-sm text-error">{error}</p>
            ) : helperText ? (
                <p className="text-sm text-text-muted">{helperText}</p>
            ) : null}
        </div>
    );
}
