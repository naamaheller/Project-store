'use client';

import { ReactNode, useEffect } from 'react';
import { Portal } from './Portal';
import { useLockBodyScroll } from './useLockBodyScroll';

type DrawerProps = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    width?: string;
};

export function Drawer({
    open,
    onClose,
    title,
    children,
    width = '400px',
}: DrawerProps) {
    useLockBodyScroll(open);

    useEffect(() => {
        if (!open) return;

        const onEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', onEsc);
        return () => window.removeEventListener('keydown', onEsc);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <Portal>
            <div className="fixed inset-0 z-50">
                <button
                    type="button"
                    className="absolute inset-0 z-0 bg-black/40"
                    onClick={onClose}
                    aria-label="Close drawer overlay"
                />

                <div
                    className="absolute left-0 top-0 z-10 h-full shadow-xl flex flex-col"
                    style={{ width }}
                    role="dialog"
                    aria-modal="true"
                    aria-label={title ?? 'Drawer'}
                >
                    <div className="h-full bg-[var(--color-background-soft)] flex flex-col">
                        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                            <div className="text-lg font-semibold">{title}</div>
                            <button
                                type="button"
                                onClick={onClose}
                                className="
                  relative z-20
                  h-9 w-9 inline-flex items-center justify-center
                  text-primary
                  transition-transform transition-colors
                  hover:scale-110 hover:text-primary-hover
                  focus:outline-none focus:ring-2 focus:ring-primary-soft rounded-md
                "
                                aria-label="Close drawer"
                                title="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-auto">{children}</div>
                    </div>
                </div>
            </div>
        </Portal>
    );
}
