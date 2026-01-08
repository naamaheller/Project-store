"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { Drawer } from "@/app/components/ui/Drawer";
import { Button } from "@/app/components/ui/Button";
import { Input } from "@/app/components/ui/Input";
import { ToggleSwitch } from "@/app/components/ui/ToggleSwitch";
import { useProductStore } from "@/app/store/product.store";
import { Check, Plus } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function CreateProductDrawer({ open, onClose }: Props) {
  const {
    categories,
    loadingCategories,
    saving,
    loadFiltersData,
    createProduct,
    uploadProductImage,
  } = useProductStore();

  const [name, setName] = useState("");

  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    loadFiltersData();
  }, [open, loadFiltersData]);

  useEffect(() => {
    if (!open) return;
    setName("");

    setDescription("");
    setPrice(0);
    setStock(0);
    setIsActive(true);

    setUseNewCategory(false);
    setCategoryId("");
    setNewCategoryName("");
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
  }, [open]);

  const canSubmit = useMemo(() => {
    if (!name.trim()) return false;
    if (useNewCategory) return !!newCategoryName.trim() && !saving;
    return categoryId !== "" && !saving;
  }, [name, useNewCategory, newCategoryName, categoryId, saving]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const payload: any = {
        name,
        description,
        price,
        stock,
        is_active: isActive ? 1 : 0,
      };

      if (useNewCategory) {
        payload.category_name = newCategoryName.trim();
      } else {
        if (categoryId === "") throw new Error("Please choose a category");
        payload.category_id = Number(categoryId);
      }

      const created = await createProduct(payload);

      if (imageFile) {
        await uploadProductImage(created.id, imageFile);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create product");
    }
  }


  return (
    <Drawer open={open} onClose={onClose} title="Add Product">
      <form onSubmit={onSubmit} className="flex h-full flex-col gap-4">
        <div className="space-y-4">
          {error ? <p className="text-sm text-error">{error}</p> : null}

          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} disabled={saving} />


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

          <div className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-text">Category</label>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setUseNewCategory((v) => !v);
                  setError(null);
                }}
                disabled={saving}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {useNewCategory ? "Choose existing" : "Add new"}
              </Button>
            </div>

            {!useNewCategory ? (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
                disabled={saving || loadingCategories}
                className={[
                  "w-full rounded-md px-3 py-2 text-base transition",
                  "bg-background text-text",
                  "border-2 border-primary/40",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary",
                  "focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  (saving || loadingCategories) && "opacity-50 cursor-not-allowed bg-background-muted",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <option value="">Select category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            ) : (
              <Input
                label={undefined}
                placeholder="New category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                disabled={saving}
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              value={String(price)}
              onChange={(e) => setPrice(Number(e.target.value))}
              disabled={saving}
            />
            <Input
              label="Stock"
              type="number"
              value={String(stock)}
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
                ) : (
                  <span className="text-sm text-text-muted">No image selected</span>
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
                {imageFile ? imageFile.name : "JPG / PNG / WebP"}
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

                {imageFile && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 px-3 text-xs"
                    disabled={saving}
                    onClick={() => {
                      setImageFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                  >
                    Remove
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
          />
        </div>

        <div className="mt-auto flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" className="flex items-center gap-2" disabled={!canSubmit}>
            <Check className="h-4 w-4" />
            Create
          </Button>
        </div>
      </form>
    </Drawer>
  );
}
