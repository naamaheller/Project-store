"use client";

import { Modal } from "@/app/components/ui/Modal";
import { Button } from "@/app/components/ui/Button";
import { useProductStore } from "@/app/store/product.store";

type Props = {
  open: boolean;
  productId: number | null;
  onClose: () => void;
};

export function DeleteProductModal({ open, productId, onClose }: Props) {
  const { products, deletingId, deleteProduct } = useProductStore();

  const product = productId
    ? products.find((p) => p.id === productId) ?? null
    : null;

  const isDeleting = productId !== null && deletingId === productId;

  return (
    <Modal
      open={open}
      onClose={isDeleting ? () => {} : onClose}
      title="Delete product"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>

          <Button
            variant="danger"
            disabled={!productId || isDeleting}
            onClick={async () => {
              if (!productId) return;
              await deleteProduct(productId);
              onClose();
            }}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </>
      }
    >
      {!productId ? (
        <div className="text-sm text-text-muted">No product selected.</div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm">
            You are about to delete{" "}
            <span className="font-semibold">
              {product?.name ?? `#${productId}`}
            </span>
            .
          </p>

          <p className="text-sm text-text-muted">
            This action cannot be undone.
          </p>
        </div>
      )}
    </Modal>
  );
}
