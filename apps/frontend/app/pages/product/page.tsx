"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";

import { fetchProducts } from "@/app/services/product.service";
import { Product } from "@/app/models/product.model";
import { ProductCardSkeleton } from "@/app/components/pruduct/ProductCardSkeleton";
import { ProductCard } from "@/app/components/pruduct/Product";
import { Pagination } from "@/app/components/ui/Pagination";

export default function ProductPage() {
  const router = useRouter();
  const { user, fetchMe, loading, ready } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loadingPage, setLoadingPage] = useState(false);

  useEffect(() => {
    if (!ready) fetchMe();
  }, [ready, fetchMe]);

  useEffect(() => {
    if (!ready) return;
    if (!user) router.replace("/pages/login");
  }, [ready, user, router]);

  // ✅ הוספנו pageSize
  useEffect(() => {
    if (!ready || !user) return;
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, user, page, pageSize]);

  async function loadProducts() {
    try {
      setLoadingPage(true);
      const result = await fetchProducts({
        page,
        per_page: pageSize,
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
        <main className="flex-1 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loadingPage
              ? Array.from({ length: pageSize }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))
              : products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </main>
      </div>

      {/* ✅ Pagination footer */}
      <footer className="mt-auto border-t border-border bg-background">
        <div className="container mx-auto px-4 py-4">
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
    </div>
  );
}
