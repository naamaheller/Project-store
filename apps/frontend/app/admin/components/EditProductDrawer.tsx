"use client";

import { useEffect, useState, useRef } from "react";

import { Drawer } from "@/app/components/ui/Drawer";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { ToggleSwitch } from "@/app/components/ui/ToggleSwitch";
import { useProductStore } from "@/app/store/product.store";
import { Check } from "lucide-react";
import { ToastProvider } from "@/app/components/ui/Toast";

type Props = {
  productId: number | null;
  open: boolean;
  onClose: () => void;
};

export function EditProductDrawer({ productId, open, onClose }: Props) {
  const { selectedProduct, saving, uploadProductImage, deleteProductImage, updateProduct } = useProductStore();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState<string | null>(null);

  const isCorrect = !!productId && selectedProduct?.id === productId;

  function handleClose() {
    onClose();
  }

  useEffect(() => {
    if (!open) {
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (!isCorrect || !selectedProduct) return;

    setName(selectedProduct.name ?? "");
    setSlug(selectedProduct.slug ?? "");
    setDescription(selectedProduct.description ?? "");
    setPrice(Number(selectedProduct.price ?? 0));
    setStock(Number(selectedProduct.stock ?? 0));
    setCategory(selectedProduct.category?.name ?? "");
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
        is_active: isActive,
        category_name: category,
      });
      if (imageFile) {
        await uploadProductImage(selectedProduct.id, imageFile);

      }
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    }
  }

  return (
    <Drawer open={open} onClose={handleClose} title="Edit Product">
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

            <div className="flex w-full flex-col gap-1.5">
              <label className="text-sm font-medium text-text">Product Image</label>

              <div className="flex flex-col items-center gap-2">
                <div className="aspect-[4/3] w-48 overflow-hidden rounded-md border border-border bg-background-muted flex items-center justify-center">
                  {imageFile ? (
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="preview"
                      className="h-full w-full object-cover"
                      onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                    />
                  ) : selectedProduct.image_url ? (
                    <img
                      src={selectedProduct.image_url}
                      alt={selectedProduct.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-sm text-text-muted">No image</span>
                  )}

                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={saving}
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />

                <div className="text-xs text-text-muted truncate max-w-[180px] text-center">
                  {imageFile
                    ? imageFile.name
                    : selectedProduct.image_url
                      ? "Current image"
                      : "JPG / PNG / WebP"}
                </div>

                <div className="flex items-center justify-center gap-2">
                  <Button
                    type="button"
                    className="h-8 px-3 text-xs"
                    disabled={saving}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose image
                  </Button>

                  {(imageFile || selectedProduct.image_url) && (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 px-3 text-xs"
                      disabled={saving}
                      onClick={async () => {
                        if (imageFile) {
                          setImageFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                          return;
                        }

                        await deleteProductImage(selectedProduct.id);
                        setImageFile(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}

                    >
                      {imageFile ? "Remove selected" : "Delete image"}
                    </Button>
                  )}

                </div>
              </div>
            </div>

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
            <Button variant="outline" onClick={handleClose} type="button" disabled={saving}>
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
