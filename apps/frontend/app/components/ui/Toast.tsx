'use client';
// מערכת Toast גלובלית להצגת הודעות זמניות.
// מבוססת על Alert, מנוהלת דרך Context ומוצגת באמצעות Portal.

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Portal } from './Portal';
import { Alert } from './Alert';

type ToastVariant = 'success' | 'warning' | 'error' | 'info';

type ToastItem = {
    id: string;
    variant: ToastVariant;
    title?: string;
    message: string;
    duration: number;
};

type ToastInput = {
    variant?: ToastVariant;
    title?: string;
    message: string;
    duration?: number;
};

type ToastContextValue = {
    show: (toast: ToastInput) => void;
    success: (message: string, title?: string, duration?: number) => void;
    error: (message: string, title?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
    remove: (id: string) => void;
    clear: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function uid() {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const remove = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const clear = useCallback(() => setToasts([]), []);

    const show = useCallback(
        (input: ToastInput) => {
            const item: ToastItem = {
                id: uid(),
                variant: input.variant ?? 'info',
                title: input.title,
                message: input.message,
                duration: input.duration ?? 3500,
            };

            setToasts((prev) => [item, ...prev]);

            window.setTimeout(() => remove(item.id), item.duration);
        },
        [remove]
    );

    const api = useMemo<ToastContextValue>(
        () => ({
            show,
            remove,
            clear,
            success: (message, title, duration) =>
                show({ variant: 'success', message, title, duration }),
            error: (message, title, duration) =>
                show({ variant: 'error', message, title, duration }),
            warning: (message, title, duration) =>
                show({ variant: 'warning', message, title, duration }),
            info: (message, title, duration) =>
                show({ variant: 'info', message, title, duration }),
        }),
        [show, remove, clear]
    );

    return (
        <ToastContext.Provider value={api}>
            {children}

            <Portal>
                <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2 w-[320px] max-w-[90vw]">
                    {toasts.map((t) => (
                        <div key={t.id} className="animate-[fadeIn_140ms_ease-out]">
                            <Alert
                                variant={t.variant}
                                title={t.title}
                                onClose={() => remove(t.id)}
                            >
                                {t.message}
                            </Alert>
                        </div>
                    ))}
                </div>
            </Portal>

            <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast חייב להיות בתוך <ToastProvider>');
    return ctx;
}
