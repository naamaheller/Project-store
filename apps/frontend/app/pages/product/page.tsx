"use client";
import React, { useEffect, useState } from "react";
import { fetchProducts } from "@/app/services/product.service";
import { Product } from "@/app/models/product.model";

function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [page]);

  async function loadProducts() {
    const result = await fetchProducts({
      page,
      per_page: 12,
    });

    setProducts(result.data);
    setLastPage(result.last_page);
  }

  return (
    <>
      <h1 style={{color: 'blue'}}>Product</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </>
  );
}

export default ProductPage;
