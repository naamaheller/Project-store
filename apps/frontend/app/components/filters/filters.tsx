"use client";

import { ChangeEvent } from "react";
import { PriceRange } from "./priceRange";

interface Category {
  id: number;
  name: string;
}

interface Props {
  categories: Category[];
  value: {
    categories: number[];
    priceMin: number;
    priceMax: number;
    search: string;
  };
  onChange: (value: Props["value"]) => void;
}

export function ProductFilters({ categories, value, onChange }: Props) {
  function toggleCategory(id: number) {
    const exists = value.categories.includes(id);

    onChange({
      ...value,
      categories: exists
        ? value.categories.filter((c) => c !== id)
        : [...value.categories, id],
    });
  }

  return (
    <div className="w-full max-w-xs flex flex-col gap-6">
      <div>
        <label className="text-sm font-medium text-text">חיפוש</label>
        <input
          type="text"
          value={value.search}
          onChange={(e) => onChange({ ...value, search: e.target.value })}
          className="mt-1 w-full border border-border rounded-md px-3 py-2 text-sm"
          placeholder="חיפוש חופשי..."
        />
      </div>

      <div>
        <p className="text-sm font-medium text-text mb-2">קטגוריות</p>
        <div className="max-h-40 overflow-y-auto flex flex-col gap-2">
          {categories.map((cat) => (
            <label
              key={cat.id}
              className="flex items-center gap-2 text-sm text-text cursor-pointer"
            >
              <input
                type="checkbox"
                checked={value.categories.includes(cat.id)}
                onChange={() => toggleCategory(cat.id)}
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-text mb-2">טווח מחיר</p>

        <PriceRange
          min={0}
          max={2000}
          valueMin={value.priceMin}
          valueMax={value.priceMax}
          onChange={(min, max) =>
            onChange({
              ...value,
              priceMin: min,
              priceMax: max,
            })
          }
        />
      </div>
    </div>
  );
}
