'use client';
// קומפוננטת Input כללית עם label, הודעת שגיאה וטקסט עזר.
// שומרת על עיצוב עקבי ונגישות.

import type { InputHTMLAttributes } from 'react';

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
        <div className="flex flex-col gap-1 w-full">
            {label ? (
                <label
                    htmlFor={inputId}
                    className="text-sm font-medium text-text"
                >
                    {label}
                </label>
            ) : null}

            <input
                id={inputId}
                disabled={disabled}
                className={[
                    'w-full rounded-md px-3 py-2 text-base transition',
                    'bg-background text-text placeholder:text-text-muted',
                    'border border-border',
                    'focus:outline-none focus:ring-2 focus:ring-primary-soft focus:border-primary',
                    error ? 'border-error focus:border-error focus:ring-error/20' : '',
                    disabled ? 'opacity-50 cursor-not-allowed bg-background-muted' : '',
                    className ?? '',
                ].join(' ')}
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
