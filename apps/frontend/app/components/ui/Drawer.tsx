'use client';
// קומפוננטת Drawer (פאנל צדדי) הנפתחת מעל העמוד.
// משתמשת ב־Portal, חוסמת גלילה ונסגרת בלחיצה על ESC או overlay.

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
                <div
                    className="absolute inset-0 bg-black/40"
                    onClick={onClose}
                />

                <div
                    className="absolute right-0 top-0 h-full bg-surface shadow-xl flex flex-col"
                    style={{ width }}
                >
                    {title && (
                        <div className="px-6 py-4 border-b border-border text-lg font-semibold">
                            {title}
                        </div>
                    )}

                    <div className="p-6 flex-1 overflow-auto">{children}</div>
                </div>
            </div>
        </Portal>
    );
}
