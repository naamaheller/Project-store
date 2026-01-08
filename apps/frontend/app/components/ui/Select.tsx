'use client';

import type { SelectHTMLAttributes } from 'react';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'>;

export function Select({
  label,
  error,
  helperText,
  options,
  placeholder = "Select option",
  disabled,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-medium text-text">
          {label}
        </label>
      ) : null}

      <select
        id={selectId}
        disabled={disabled}
        className={[
          'w-full rounded-md px-3 py-2 text-base transition',
          'bg-background text-text',
          'border border-border',
          'focus:outline-none focus:ring-2 focus:ring-primary-soft focus:border-primary',
          error ? 'border-error focus:border-error focus:ring-error/20' : '',
          disabled ? 'opacity-50 cursor-not-allowed bg-background-muted' : '',
          className ?? '',
        ].join(' ')}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="text-sm text-error">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-text-muted">{helperText}</p>
      ) : null}
    </div>
  );
}
