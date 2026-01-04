"use client";

import ProductFiltersState from "@/app/models/product-filters.model";
import { RangePrice } from "./PriceRange";
import { FilterCategory } from "./CategoryFilter";
import { InputSearch } from "./SearchInput";
import { useEffect, useState } from "react";
import { fetchCategories } from "@/app/services/category.service";
import { Category } from "@/app/models/category.model";
import { fetchMaxPrice } from "@/app/services/product.service";
import { Button } from "../ui/Button";

type Props = {
  filters: ProductFiltersState;
  onChange: (filters: ProductFiltersState) => void;
  onApply: () => void;
  onClear: () => void;
  applied: boolean;
  absoluteMaxPrice: number;
  setAbsoluteMaxPrice: (price: number) => void;
};

export function FiltersProduct({
  filters,
  onChange,
  onApply,
  onClear,
  applied,
  absoluteMaxPrice,
  setAbsoluteMaxPrice
}: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMaxPrice, setLoadingMaxPrice] = useState(true);

  useEffect(() => {
    const loadMaxPrice = async () => {
      try {
        const priceMax = await fetchMaxPrice();
        setAbsoluteMaxPrice(priceMax);
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

  const clearFilters = () => {
    onChange({
      search: "",
      minPrice: null,
      maxPrice: filters.maxPrice,
      categories: [],
    });

    onApply();
  };

  return (
    <div className="w-64 space-y-12">
      <InputSearch
        value={filters.search}
        onChange={(value) => onChange({ ...filters, search: value })}
      />

      {loadingMaxPrice ? (
        <p>Loading price range...</p>
      ) : (
        <RangePrice
          min={0}
          max={absoluteMaxPrice}
          value={filters.maxPrice ?? absoluteMaxPrice}
          onChange={(value) => onChange({ ...filters, maxPrice: value })}
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

      <Button
        onClick={applied ? onClear : onApply}
        className={`w-full py-2 rounded transition
    ${
      applied
        ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
        : "bg-primary text-white hover:opacity-90"
    }`}
      >
        {applied ? "Clear filters" : "Filter"}
      </Button>
    </div>
  );
}
