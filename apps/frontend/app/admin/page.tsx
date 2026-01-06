// AdminProductsPage.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useProductStore } from "../store/product.store";
import { Table, type Column } from "@/app/components/ui/Table";
import { Button } from "@/app/components/ui/Button";
import { Pagination } from "@/app/components/ui/Pagination";
import type { Product } from "@/app/models/product.model";
import { EditProductDrawer } from "./components/EditProductDrawer";
import { Trash2, Pencil } from "lucide-react";
import { DeleteProductModal } from "./components/DeleteProductModal";
import { CreateProductDrawer } from "./components/CreateProductDrawer"; // NEW

export default function AdminProductsPage() {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingModalId, setDeletingModalId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false); // NEW

  const didInitialLoad = useRef(false);

  const {
    products,
    page,
    pageSize,
    total,
    loading,
    loadProducts,
    setPage,
    setPageSize,
    selectProduct,
    clearSelectedProduct,
  } = useProductStore();

  useEffect(() => {
    if (didInitialLoad.current) return;
    didInitialLoad.current = true;
    loadProducts();
  }, [loadProducts]);

  const columns = useMemo<Column<Product>[]>(() => [
    {
      key: "image",
      header: "Image",
      cell: (p) => (
        <img src={p.img_url} alt={p.name} className="w-16 h-16 object-cover rounded-md" />
      ),
    },
    { key: "name", header: "Name", cell: (p) => <span className="font-medium">{p.name}</span> },
    { key: "price", header: "Price", cell: (p) => `₪${p.price}` },
    { key: "category", header: "Category", cell: (p) => p.category?.name ?? "-" },
    {
      key: "actions",
      header: "Actions",
      className: "space-x-2",
      cell: (p) => (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="destructive"
            onClick={() => {
              selectProduct(p);
              setEditingId(p.id);
            }}
            aria-label={`Edit ${p.name}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="destructive"
            onClick={() => setDeletingModalId(p.id)}
            aria-label={`Delete ${p.name}`}
          >
            <Trash2 className="h-4 w-4 text-error" />
          </Button>
        </div>
      ),
    },
  ], [selectProduct]);

  return (
    <div className="flex flex-col min-h-screen gap-6">
      <div className="flex items-center justify-between">
        <Button onClick={() => setCreateOpen(true)}>+</Button>
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

      <CreateProductDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      <EditProductDrawer
        open={editingId !== null}
        productId={editingId}
        onClose={() => {
          setEditingId(null);
          clearSelectedProduct();
        }}
      />

      <DeleteProductModal
        open={deletingModalId !== null}
        productId={deletingModalId}
        onClose={() => setDeletingModalId(null)}
      />
    </div>
  );
}
