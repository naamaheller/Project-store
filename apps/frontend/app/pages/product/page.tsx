"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";

import { fetchProducts } from "@/app/services/product.service";
import { Product } from "@/app/models/product.model";
import { ProductCardSkeleton } from "@/app/components/pruduct/ProductCardSkeleton";
import { ProductCard } from "@/app/components/pruduct/Product";
import { Pagination } from "@/app/components/ui/Pagination";
import { ProductShowModal } from "@/app/components/pruduct/productShow";

export default function ProductPage() {
  const router = useRouter();
  const { user, fetchMe, loading, ready } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    categories: [] as number[],
    priceMin: null,
    priceMax: null,
    search: "",
  });

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
  }, [ready, user, page]);

  async function loadProducts() {
    try {
      setLoadingPage(true);
      const result = await fetchProducts({
        page,
        per_page: pageSize,
        category_id: filters.categories,
        min_price: filters.priceMin ?? undefined,
        max_price: filters.priceMax ?? undefined,
        search: filters.search || undefined,
      });

      setProducts(result.data);
      setTotal(result.total);
    } finally {
      setLoadingPage(false);
    }
  }

  if (!ready || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4">
        {/* Products */}
        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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

      {/* Pagination */}
      <div className="mt-auto pt-6">
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

      <ProductShowModal
        open={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

    </div>
  );
}
