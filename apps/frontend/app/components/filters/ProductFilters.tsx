"use client";

import ProductFiltersState from "@/app/models/product-filters.model";
import { RangePrice } from "./PriceRange";
import { FilterCategory } from "./CategoryFilter";
import { InputSearch } from "./SearchInput";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/app/services/category.service";
import { Category } from "@/app/models/category.model";
import { fetchMaxPrice } from "@/app/services/product.service";

type Props = {
  filters: ProductFiltersState;
  onChange: (filters: ProductFiltersState) => void;
  onApply: () => void;
};

export function FiltersProduct({ filters, onChange, onApply }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMaxPrice, setLoadingMaxPrice] = useState(true);

  useEffect(() => {
    const loadMaxPrice = async () => {
      try {
        const priceMax = await fetchMaxPrice();
        onChange({ ...filters, maxPrice: priceMax });
      } catch (error) {
        console.error("Failed to load max price", error);
      } finally {
        setLoadingMaxPrice(false);
      }
    };

    loadMaxPrice();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await fetchCategories();
        setCategories(result);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  return (
    <div className="w-64 space-y-4">
      <InputSearch
        value={filters.search}
        onChange={(value) => onChange({ ...filters, search: value })}
      />

      {loadingMaxPrice ? (
        <p>Loading price range...</p>
      ) : (
        <RangePrice
          min={filters.minPrice}
          max={filters.maxPrice}
          onChange={(min, max) =>
            onChange({ ...filters, minPrice: min, maxPrice: max })
          }
        />
      )}

      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <FilterCategory
          categories={categories}
          selected={filters.categories}
          onChange={(categories) => onChange({ ...filters, categories })}
        />
      )}

      <button
        onClick={onApply}
        className="w-full bg-primary text-white py-2 rounded"
      >
        filter...
      </button>
    </div>
  );
}
