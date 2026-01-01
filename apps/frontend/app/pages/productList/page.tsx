"use client";
import React, { useEffect, useState } from "react";
import { fetchProducts } from "@/app/services/product.service";
import { Product } from "@/app/models/product.model";
import { ProductCard } from "@/app/components/Product";
import { ProductCardSkeleton } from "@/app/components/ProductCardSkeleton";
import { Pagination } from "@/app/components/ui/Pagination";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [page, pageSize]);

  async function loadProducts() {
    try {
      setLoading(true);
      const result = await fetchProducts({
        page,
        per_page: pageSize,
      });

      setProducts(result.data);
      setTotal(result.total);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-4">
          {/* Products */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading
                ? Array.from({ length: pageSize }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                : products.map((p) => <ProductCard key={p.id} product={p} />)}
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
    </div>
  );
}
