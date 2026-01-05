"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useProductStore } from "../store/product.store";
import { Table, type Column } from "@/app/components/ui/Table";
import { Button } from "@/app/components/ui/Button";
import { Pagination } from "@/app/components/ui/Pagination";
import type { Product } from "@/app/models/product.model";
import { EditProductDrawer } from "./components/EditProductDrawer";


export default function AdminProductsPage() {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  

  const {
    products,
    page,
    pageSize,
    total,
    loading,
    loadProducts,
    setPage,
    setPageSize,
  } = useProductStore();

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const columns = useMemo<Column<Product>[]>(() => [
    {
      key: "image",
      header: "Image",
      cell: (p) => (
        <img
          src={p.image}
          alt={p.name}
          className="w-16 h-16 object-cover rounded-md"
        />
      ),
    },
    {
      key: "name",
      header: "Name",
      cell: (p) => <span className="font-medium">{p.name}</span>,
    },
    {
      key: "price",
      header: "Price",
      cell: (p) => `₪${p.price}`,
    },
    {
      key: "category",
      header: "Category",
      cell: (p) => p.category?.name ?? "-",
    },
    {
      key: "actions",
      header: "Actions",
      className: "space-x-2",
      cell: (p) => (
        <>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditingId(p.id)}
          >
            Edit
          </Button>

          <Button size="sm" variant="destructive">
            Delete
          </Button>
        </>
      ),
    },
  ], []);

  return (
    <div className="flex flex-col min-h-screen gap-6">
      <div className="flex items-center justify-between">
        <Button onClick={() => router.push("/admin/products/create")}>
          + Add Product
        </Button>
      </div>

      <Table<Product>
        columns={columns}
        rows={products}
        rowKey={(p) => p.id}
        loading={loading}
        emptyTitle="No products"
        emptyDescription="Start by creating your first product"
      />

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

      {/* Drawer */}
      <EditProductDrawer
        open={editingId !== null}
        productId={editingId}
        onClose={() => {
          setEditingId(null);
          useProductStore.getState().clearSelectedProduct();
        }}
      />
    </div>
  );
}
