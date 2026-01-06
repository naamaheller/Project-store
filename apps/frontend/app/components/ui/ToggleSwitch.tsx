"use client";

import type { InputHTMLAttributes } from "react";

type ToggleSwitchProps = {
  label?: string;
  error?: string;
  helperText?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export function ToggleSwitch({
  label,
  error,
  helperText,
  disabled,
  className,
  id,
  checked,
  onChange,
  ...props
}: ToggleSwitchProps) {
  const inputId = id ?? props.name;

  return (
    <div className="flex w-full flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-text">
          {label}
        </label>
      )}

      <label
        htmlFor={inputId}
        className={[
          "inline-flex w-fit items-center",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        ].join(" ")}
      >
        <input
          id={inputId}
          type="checkbox"
          className="sr-only peer"
          disabled={disabled}
          checked={!!checked}
          onChange={onChange}
          {...props}
        />

        {/* Track */}
        <div
          className={[
            "relative h-6 w-11 rounded-full transition-colors",
            "bg-background-muted border-2 border-primary/40",
            "peer-checked:bg-primary",

            // focus-visible (keyboard)
            "peer-focus-visible:outline-none",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-primary/20",
            "peer-focus-visible:border-primary",
            "peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",

            // error
            error &&
              "border-error peer-checked:bg-error peer-focus-visible:ring-error/20 peer-focus-visible:border-error",

            // Thumb
            "after:content-[''] after:absolute after:top-1/2 after:left-1",
            "after:-translate-y-1/2 after:h-4 after:w-4 after:rounded-full",
            "after:bg-background after:shadow-sm after:transition-transform",
            "after:border after:border-primary/30",

            // checked moves thumb right
            "peer-checked:after:translate-x-5",

            // error thumb border
            error && "after:border-error",

            className ?? "",
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </label>

      {error ? (
        <p className="text-sm text-error">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
