"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { useAuthStore } from "../../../store/auth.store";
import { ProductCardSkeleton } from "@/app/components/pruduct/ProductCardSkeleton";
import { ProductCard } from "@/app/components/pruduct/Product";
import { Pagination } from "@/app/components/ui/Pagination";
import { ProductShowModal } from "@/app/components/pruduct/productShow";
import { FiltersProduct } from "@/app/components/filters/ProductFilters";
import { Drawer } from "@/app/components/ui/Drawer";
import { Button } from "@/app/components/ui/Button";
import { useProductStore } from "@/app/store/product.store";
import LoadingText from "@/app/components/state/loading/Loading";
import { EmptyState } from "@/app/components/state/empty/EmptyState";
import { SlidersHorizontal, Settings } from "lucide-react";

export default function ProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { user, checking, ready } = useAuthStore();
  const isAdmin = Array.isArray(user?.roles) && user.roles.includes("admin");
  const filtersLoadedRef = useRef(false);
  const initialFetchDoneRef = useRef(false);
  const lastSearchRef = useRef<string | null>(null);

  const {
    products,
    page,
    pageSize,
    total,
    loading: loadingPage,
    filters,
    filtersApplied,
    absoluteMaxPrice,
    categories,
    loadingCategories,
    loadingMaxPrice,
    hasFetched,

    setPage,
    setPageSize,
    setFilters,
    applyFilters,
    clearFilters,
    loadFiltersData,
    selectProduct,
  } = useProductStore();

  const [filtersOpen, setFiltersOpen] = useState(false);

  const initializedFromUrlRef = useRef(false);

  useEffect(() => {
    if (!ready || !user) return;
    if (filtersLoadedRef.current) return;

    filtersLoadedRef.current = true;
    loadFiltersData();
  }, [ready, user]);

  useEffect(() => {
    if (!ready || !user) return;
    if (initializedFromUrlRef.current) return;

    const search = searchParams.get("search") ?? "";
    const maxPrice = searchParams.get("max-price");
    const minPrice = searchParams.get("min-price");
    const cats = searchParams.get("categories");

    setFilters({
      search,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      categories: cats ? cats.split(",").map(Number) : [],
    });
    lastSearchRef.current = search;
    initializedFromUrlRef.current = true;
    applyFilters().finally(() => {
      initialFetchDoneRef.current = true;
    });
  }, [ready, user]);

  useEffect(() => {
    if (!ready || !user) return;
    if (!initialFetchDoneRef.current) return;

    if (filters.search === lastSearchRef.current) return;

    lastSearchRef.current = filters.search;

    const timeout = setTimeout(() => {
      applyFilters();
    }, 400);

    return () => clearTimeout(timeout);
  }, [filters.search]);

  useEffect(() => {
    if (!initializedFromUrlRef.current) return;

    if (!filtersApplied) {
      router.replace("?", { scroll: false });
      return;
    }

    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.minPrice !== null)
      params.set("min-price", String(filters.minPrice));

    if (filters.maxPrice !== null && filters.maxPrice < absoluteMaxPrice) {
      params.set("max-price", String(filters.maxPrice));
    }

    if (filters.categories.length) {
      params.set("categories", filters.categories.join(","));
    }

    router.replace(`?${params.toString()}`, { scroll: false });
  }, [filtersApplied, filters, absoluteMaxPrice, router]);

  const handleApplyFilters = () => {
    applyFilters();
    setFiltersOpen(false);
  };

  const handleClearFilters = () => {
    clearFilters();
    setFiltersOpen(false);
  };

  if (!ready || checking) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <LoadingText />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 px-6 pb-2">
        <div className="flex gap-7">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <FiltersProduct
                filters={filters}
                onChange={setFilters}
                categories={categories}
                absoluteMaxPrice={absoluteMaxPrice}
                loadingCategories={loadingCategories}
                loadingMaxPrice={loadingMaxPrice}
                onApply={applyFilters}
                onClear={clearFilters}
                applied={filtersApplied}
              />
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="lg:hidden">
                <Button
                  onClick={() => setFiltersOpen(true)}
                  className="flex items-center gap-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
              </div>

              <div className="flex-1" />

              {isAdmin && (
                <button
                  onClick={() => router.push("/admin")}
                  className="
        p-1
        text-text-muted
        hover:text-primary
        transition
        focus:outline-none
      "
                  aria-label="Admin settings"
                  title="Admin settings"
                >
                  <Settings className="h-6 w-6" />
                </button>
              )}
            </div>

            <div className="grid gap-4 sm:gap-6 lg:gap-8
                grid-cols-1
                sm:grid-cols-2
                md:grid-cols-3
                lg:grid-cols-4">
              {loadingPage &&
                Array.from({ length: pageSize }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}

              {!loadingPage &&
                products.length > 0 &&
                products.map((p) => (
                  <ProductCard key={p.id} product={p} onClick={selectProduct} />
                ))}

              {!loadingPage && hasFetched && products.length === 0 && (
                <EmptyState
                  title={
                    filtersApplied
                      ? "No products match your filters"
                      : "No products available"
                  }
                  description={
                    filtersApplied
                      ? "Try adjusting or clearing the filters to see more products."
                      : "Products will appear here once they are available."
                  }
                  actionLabel="Clear filters"
                  onAction={filtersApplied ? clearFilters : undefined}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      <footer className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-[2px]">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      </footer>

      <ProductShowModal />

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters Products"
        width="min(420px, 90vw)"
      >
        <FiltersProduct
          filters={filters}
          onChange={setFilters}
          categories={categories}
          absoluteMaxPrice={absoluteMaxPrice}
          loadingCategories={loadingCategories}
          loadingMaxPrice={loadingMaxPrice}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          applied={filtersApplied}
        />
      </Drawer>
    </div>
  );
}
