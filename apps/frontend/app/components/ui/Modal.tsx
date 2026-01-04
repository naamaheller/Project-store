"use client";

import { ReactNode, useEffect } from "react";
import { Portal } from "./Portal";
import { useLockBodyScroll } from "./useLockBodyScroll";
import { X } from "lucide-react";

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
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={onClose} />

        <div className="relative z-10 w-full max-w-md bg-surface rounded-lg shadow-lg">
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-3 right-3 text-text-muted hover:text-text transition "
          >
            <X size={18} />
          </button>

          {title && (
            <div className="px-6 py-4 border-b border-border text-lg font-semibold">
              {title}
            </div>
          )}

          <div className="p-6">{children}</div>

          {footer && (
            <div className="px-6 py-4 border-t border-border flex justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}
