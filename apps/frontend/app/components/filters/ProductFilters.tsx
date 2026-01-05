"use client";

import ProductFiltersState from "@/app/models/product-filters.model";
import { RangePrice } from "./PriceRange";
import { FilterCategory } from "./CategoryFilter";
import { InputSearch } from "./SearchInput";
import { Category } from "@/app/models/category.model";
import { Button } from "../ui/Button";

type Props = {
  filters: ProductFiltersState;
  onChange: (filters: Partial<ProductFiltersState>) => void;

  categories: Category[];
  absoluteMaxPrice: number;

  loadingCategories: boolean;
  loadingMaxPrice: boolean;

  onApply: () => void;
  onClear: () => void;
  applied: boolean;
};

export function FiltersProduct({
  filters,
  onChange,
  categories,
  absoluteMaxPrice,
  loadingCategories,
  loadingMaxPrice,
  onApply,
  onClear,
  applied,
}: Props) {
  return (
    <div className="w-64 space-y-12">
      <InputSearch
        value={filters.search}
        onChange={(value) => onChange({ search: value })}
      />

      {loadingMaxPrice ? (
        <p>Loading price range...</p>
      ) : (
        <RangePrice
          min={0}
          max={absoluteMaxPrice}
          value={filters.maxPrice ?? absoluteMaxPrice}
          onChange={(value) =>
            onChange({
              maxPrice: value < absoluteMaxPrice ? value : null,
            })
          }
        />
      )}

      {loadingCategories ? (
        <p>Loading categories...</p>
      ) : (
        <FilterCategory
          categories={categories}
          selected={filters.categories}
          onChange={(categories) => onChange({ categories })}
        />
      )}

      <Button onClick={applied ? onClear : onApply} className="w-full">
        {applied ? "Clear filters" : "Filter"}
      </Button>
    </div>
  );
}
