"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/auth.store";

import { fetchProducts } from "@/app/services/product.service";
import { Product } from "@/app/models/product.model";

function ProductPage() {
  const router = useRouter();
  const { user, fetchMe, loading } = useAuthStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/pages/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;

    loadProducts();
  }, [page, user]);

  async function loadProducts() {
    const result = await fetchProducts({
      page,
      per_page: 12,
    });

    setProducts(result.data);
    setLastPage(result.last_page);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <h1 style={{ color: "blue" }}>Products</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </>
  );
}

export default ProductPage;
