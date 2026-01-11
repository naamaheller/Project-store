'use client';

import type { ReactNode } from 'react';
import { Button } from './Button';

type EmptyStateProps = {
    title: string;
    description?: string;
    icon?: ReactNode;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
};

export function EmptyState({
    title,
    description,
    icon,
    actionLabel,
    onAction,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={[
                'flex flex-col items-center justify-center text-center',
                'px-6 py-10 gap-3',
                className ?? '',
            ].join(' ')}
        >
            {icon ? <div className="text-4xl text-text-muted">{icon}</div> : null}

            <div className="text-lg font-semibold text-text">{title}</div>

            {description ? (
                <div className="text-sm text-text-muted max-w-sm">{description}</div>
            ) : null}

            {actionLabel && onAction ? (
                <Button onClick={onAction} className="mt-2">
                    {actionLabel}
                </Button>
            ) : null}
        </div>
    );
}
