"use client";

import { useEffect } from "react";
import { Drawer } from "@/app/components/ui/Drawer";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { useProductStore } from "@/app/store/product.store";

type Props = {
  productId: number | null;
  open: boolean;
  onClose: () => void;
};

export function EditProductDrawer({ productId, open, onClose }: Props) {
  const { selectedProduct, loadProductById } = useProductStore();

  useEffect(() => {
    if (productId) {
      loadProductById(productId);
    }
  }, [productId, loadProductById]);

  return (
    <Drawer open={open} onClose={onClose}>
      <div className="flex flex-col h-full p-6 gap-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h2 className="text-lg font-semibold">Edit Product</h2>
          <Button size="sm" variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>

        {!selectedProduct ? (
          <div>Loading...</div>
        ) : (
          <>
            {/* Example fields */}
            <div className="space-y-4">
              <div>
                <label className="text-sm">Name</label>
                <Input
                  type="text"
                  defaultValue={selectedProduct.name}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm">Price</label>
                <Input
                  type="number"
                  defaultValue={selectedProduct.price}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-auto flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button>Save</Button>
            </div>
          </>
        )}
      </div>
    </Drawer>
  );
}
