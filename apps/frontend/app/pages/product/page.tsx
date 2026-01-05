"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";
import { SlidersHorizontal } from "lucide-react";

import { fetchProducts } from "@/app/services/product.service";
import { Product } from "@/app/models/product.model";
import { ProductCardSkeleton } from "@/app/components/pruduct/ProductCardSkeleton";
import { ProductCard } from "@/app/components/pruduct/Product";
import { Pagination } from "@/app/components/ui/Pagination";
import { ProductShowModal } from "@/app/components/pruduct/productShow";
import ProductFiltersState from "@/app/models/product-filters.model";
import { FiltersProduct } from "@/app/components/filters/ProductFilters";
import { Drawer } from "@/app/components/ui/Drawer";
import { Button } from "@/app/components/ui/Button";

export default function ProductPage() {
  const router = useRouter();
  const { user, fetchMe, loading, ready } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [absoluteMaxPrice, setAbsoluteMaxPrice] = useState<number>(0);

  const [filters, setFilters] = useState<ProductFiltersState>({
    search: "",
    minPrice: null,
    maxPrice: null,
    categories: [],
  });

  const [filtersApplied, setFiltersApplied] = useState(false);

  useEffect(() => {
    if (!ready) fetchMe();
  }, [ready, fetchMe]);

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/pages/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!ready || !user) return;
    loadProducts();
  }, [ready, user, page, pageSize, filters.search]);

  async function loadProducts(overrideFilters?: Partial<ProductFiltersState>) {
    const finalFilters = { ...filters, ...overrideFilters };

    try {
      setLoadingPage(true);

      const result = await fetchProducts({
        page,
        per_page: pageSize,
        search: finalFilters.search,
        min_price: finalFilters.minPrice ?? undefined,
        max_price: finalFilters.maxPrice ?? undefined,
        categories: finalFilters.categories,
      });

      setProducts(result.data);
      setTotal(result.total);
    } finally {
      setLoadingPage(false);
    }
  }

  if (!ready || loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <div className="flex-1 px-6">
        <div className="flex gap-7">
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24">
              <FiltersProduct
                filters={filters}
                onChange={setFilters}
                absoluteMaxPrice={absoluteMaxPrice}
                setAbsoluteMaxPrice={setAbsoluteMaxPrice}
                onApply={() => {
                  setPage(1);
                  setFiltersApplied(true);
                  loadProducts(filters);
                }}
                onClear={() => {
                  const cleared: ProductFiltersState = {
                    search: "",
                    minPrice: null,
                    maxPrice: absoluteMaxPrice,
                    categories: [],
                  };

                  setFilters(cleared);
                  setFiltersApplied(false);
                  setPage(1);
                  loadProducts(cleared);
                }}
                applied={filtersApplied}
              />
            </div>
          </aside>

          <main className="flex-1">
            <div className="lg:hidden">
              <Button
                onClick={() => setFiltersOpen(true)}
                className="mb-6 flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {loadingPage
                ? Array.from({ length: pageSize }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : products.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onClick={setSelectedProduct}
                    />
                  ))}
            </div>
          </main>
        </div>
      </div>

      {/* footer */}
      <footer className="border-t border-border bg-background">
        <div className="container mx-auto px-4 py-[2px]">
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={setPage}
            onPageSizeChange={(size) => {
              setPage(1);
              setPageSize(size);
            }}
          />
        </div>
      </footer>

      <ProductShowModal
        open={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters Products"
        width="min(420px, 90vw)"
      >
        <FiltersProduct
          filters={filters}
          onChange={setFilters}
          absoluteMaxPrice={absoluteMaxPrice}
          setAbsoluteMaxPrice={setAbsoluteMaxPrice}
          onApply={() => {
            setPage(1);
            setFiltersApplied(true);
            loadProducts(filters);
            setFiltersOpen(false);
          }}
          onClear={() => {
            const cleared: ProductFiltersState = {
              search: "",
              minPrice: null,
              maxPrice: absoluteMaxPrice,
              categories: [],
            };

            setFilters(cleared);
            setFiltersApplied(false);
            setPage(1);
            loadProducts(cleared);
            setFiltersOpen(false);
          }}
          applied={filtersApplied}
        />
      </Drawer>
    </div>
  );
}
