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

  const price =
    typeof product.price === "number"
      ? product.price.toFixed(2)
      : String(product.price);

  return (
    <Modal open={open} onClose={onClose} title={product.name}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image */}
        <div className="rounded-lg border border-border bg-background-muted/60 p-4">
          <div className="aspect-square rounded-md bg-background-muted flex items-center justify-center text-text-muted overflow-hidden">
            {product.img_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.img_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm">IMAGE</span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          {/* Title + Category badge */}
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-text leading-snug">
              {product.name}
            </h2>

            {product.category?.name && (
              <div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {product.category.name}
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <p className="text-xl font-bold text-primary">₪{price}</p>

          {/* Description */}
          {product.description ? (
            <p className="text-sm text-text-muted leading-relaxed">
              {product.description}
            </p>
          ) : (
            <p className="text-sm text-text-muted">No description available.</p>
          )}

          {/* Nothing else here (no stock, no footer) */}
        </div>
      </div>
    </Modal>
  );
}
