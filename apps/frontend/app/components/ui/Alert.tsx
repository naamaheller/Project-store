'use client';

import type { ReactNode } from 'react';

type AlertVariant = 'success' | 'warning' | 'error' | 'info';

type AlertProps = {
    variant?: AlertVariant;
    title?: string;
    children?: ReactNode;
    onClose?: () => void;
    className?: string;
};

const variantStyles: Record<AlertVariant, { box: string; title: string; text: string }> = {
    success: {
        box: 'border-success/30 bg-success/10',
        title: 'text-success',
        text: 'text-text',
    },
    warning: {
        box: 'border-warning/30 bg-warning/10',
        title: 'text-warning',
        text: 'text-text',
    },
    error: {
        box: 'border-error/30 bg-error/10',
        title: 'text-error',
        text: 'text-text',
    },
    info: {
        box: 'border-border bg-background-muted',
        title: 'text-text',
        text: 'text-text-muted',
    },
};

export function Alert({
    variant = 'info',
    title,
    children,
    onClose,
    className,
}: AlertProps) {
    const v = variantStyles[variant];

    return (
        <div
            role="alert"
            className={[
                'w-full rounded-lg border px-4 py-3',
                'flex items-start gap-3',
                v.box,
                className ?? '',
            ].join(' ')}
        >
            <div className="flex-1">
                {title ? (
                    <div className={['font-semibold', v.title].join(' ')}>{title}</div>
                ) : null}
                {children ? <div className={['text-sm mt-1', v.text].join(' ')}>{children}</div> : null}
            </div>

            {onClose ? (
                <button
                    type="button"
                    onClick={onClose}
                    className="text-text-muted hover:text-text transition"
                    aria-label="סגור"
                >
                    ✕
                </button>
            ) : null}
        </div>
    );
}
