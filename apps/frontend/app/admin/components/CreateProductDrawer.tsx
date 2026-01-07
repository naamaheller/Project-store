// components/CreateProductDrawer.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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
    loadFiltersData, // loads categories already in your store
    createProduct,
  } = useProductStore();

  const [name, setName] = useState("");
 
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [imgUrl, setImgUrl] = useState("");
  const [isActive, setIsActive] = useState(true);

  // category
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    loadFiltersData(); // ensures categories are loaded
  }, [open, loadFiltersData]);

  useEffect(() => {
    if (!open) return;
    setName("");
    
    setDescription("");
    setPrice(0);
    setStock(0);
    setImgUrl("");
    setIsActive(true);

    setUseNewCategory(false);
    setCategoryId("");
    setNewCategoryName("");

    setError(null);
  }, [open]);

  const canSubmit = useMemo(() => {
    if (!name.trim() ) return false;
    if (useNewCategory) return !!newCategoryName.trim() && !saving;
    return categoryId !== "" && !saving;
  }, [name,  useNewCategory, newCategoryName, categoryId, saving]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      const payload: any = {
        name,
        
        description,
        price,
        stock,
        img_url: imgUrl,
        is_active: isActive ,
      };

      if (useNewCategory) {
        payload.category_name = newCategoryName.trim();
      } else {
        if (categoryId === "") throw new Error("Please choose a category");
        payload.category_id = Number(categoryId);
      }
      console.log(payload);
      await createProduct(payload);

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

          {/* Category chooser */}
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

          <Input label="Image URL" value={imgUrl} onChange={(e) => setImgUrl(e.target.value)} disabled={saving} />

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
