"use client";

import { useEffect, useState } from "react";

import { Drawer } from "@/app/components/ui/Drawer";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { ToggleSwitch } from "@/app/components/ui/ToggleSwitch"; // adjust path if different
import { useProductStore } from "@/app/store/product.store";
import { Check } from "lucide-react";
import { ToastProvider } from "@/app/components/ui/Toast";

type Props = {
  productId: number | null;
  open: boolean;
  onClose: () => void;
};

export function EditProductDrawer({ productId, open, onClose }: Props) {
  const { selectedProduct, saving, updateProduct } = useProductStore();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [imgUrl, setImgUrl] = useState("");
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState<boolean>(true);

  const [error, setError] = useState<string | null>(null);

  const isCorrect = !!productId && selectedProduct?.id === productId;

  useEffect(() => {
    if (!open || !isCorrect || !selectedProduct) return;

    setName(selectedProduct.name ?? "");
    setSlug(selectedProduct.slug ?? "");
    setDescription(selectedProduct.description ?? "");
    setPrice(Number(selectedProduct.price ?? 0));
    setStock(Number(selectedProduct.stock ?? 0));
    setImgUrl(selectedProduct.img_url ?? "");
    setCategory(selectedProduct.category?.name??"");
    setIsActive(Boolean(selectedProduct.is_active));
    setError(null);
  }, [open, isCorrect, selectedProduct]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return;

    setError(null);

    try {
      await updateProduct(selectedProduct.id, {
        name,
        slug,
        description,
        price,
        stock,
        img_url: imgUrl,
        is_active: isActive ? 1 : 0, 
        category_name: category,
      });

      onClose();

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="Edit Product">
      {!isCorrect || !selectedProduct ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : (
        <form onSubmit={onSubmit} className="flex h-full flex-col gap-4">
          <div className="space-y-4">
            {error ? <p className="text-sm text-error">{error}</p> : null}

            <Input
              label="Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={saving}
            />

            <Input
              label="Slug"
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              disabled={saving}
            />

            {/* If you want textarea to match Input styling, we can make a Textarea component too */}
            <div className="flex w-full flex-col gap-1">
              <label className="text-sm font-medium text-text">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={saving}
                className={[
                  "w-full rounded-md px-3 py-2 text-base transition",
                  "bg-background text-text placeholder:text-text-muted",
                  "border-2 border-primary/40",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  saving && "opacity-50 cursor-not-allowed bg-background-muted",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            </div>

           <Input
                label="Category"
                type="text"
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                disabled={saving}
              />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price"
                type="number"
                value={Number.isFinite(price) ? String(price) : "0"}
                onChange={(e) => setPrice(Number(e.target.value))}
                disabled={saving}
              />

              <Input
                label="Stock"
                type="number"
                value={Number.isFinite(stock) ? String(stock) : "0"}
                onChange={(e) => setStock(Number(e.target.value))}
                disabled={saving}
              />
            </div>

            <Input
              label="Image URL"
              type="text"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              disabled={saving}
            />

            {/* Toggle for Active */}
            <ToggleSwitch
              name="is_active"
              label="Active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={saving}
              error={undefined}
              
            />
          </div>
          


          <div className="mt-auto flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button" disabled={saving}>
              Cancel
            </Button>

            <Button type="submit" className="flex items-center gap-2" disabled={saving}>
              <Check className="h-4 w-4" />
              Save
            </Button>
          </div>
        </form>
      )}
    </Drawer>
  );
}
