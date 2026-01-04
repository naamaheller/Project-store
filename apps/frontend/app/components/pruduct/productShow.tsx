"use client";

import { Product } from "@/app/models/product.model";
import { Modal } from "@/app/components/ui/Modal";

type Props = {
  open: boolean;
  onClose: () => void;
  product: Product | null;
};

export function ProductShowModal({ open, onClose, product }: Props) {
  if (!product) return null;

  return (
    <Modal open={open} onClose={onClose} title={product.name}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-square bg-background-muted rounded-lg flex items-center justify-center text-text-muted">
          IMAGE
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-text">{product.name}</h2>

          <p className="text-xl font-bold text-primary">₪{product.price}</p>

          {product.description && (
            <p className="text-sm text-text-muted leading-relaxed">
              {product.description}
            </p>
          )}

          {product.category?.name && (
            <div className="mt-auto">
              <span className="inline-block text-xs px-3 py-1 rounded-full bg-primary/10 text-primary">
                {product.category?.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
