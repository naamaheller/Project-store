"use client";

import { ReactNode, useEffect } from "react";
import { Portal } from "./Portal";
import { useLockBodyScroll } from "./useLockBodyScroll";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <div
          className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
          onClick={onClose}
        />

        <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-xl border-[3px] border-primary/50 bg-surface shadow-lg animate-modalIn">
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-border">
            <div className="min-w-0">
              {title && (
                <h3 className="truncate text-lg font-semibold text-text">
                  {title}
                </h3>
              )}
            </div>

            <button
              onClick={onClose}
              aria-label="Close modal"
              className={[
                "text-3xl leading-none text-text-muted",
                "transition-transform duration-200 ease-out",
                "hover:text-text hover:-translate-y-0.5",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              ].join(" ")}
            >
              ×
            </button>
          </div>

          <div className="p-6">{children}</div>

          {footer && (
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-background-muted/30">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}
