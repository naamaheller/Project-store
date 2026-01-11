"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, Plus, ArrowLeft } from "lucide-react";
import { useProductStore } from "../store/product.store";
import { createFile } from "@/app/services/files.service";
import { Table, type Column } from "@/app/components/ui/Table";
import { Button } from "@/app/components/ui/Button";
import { Pagination } from "@/app/components/ui/Pagination";
import type { Product } from "@/app/models/product.model";
import { EditProductDrawer } from "./components/EditProductDrawer";
import { DeleteProductModal } from "./components/DeleteProductModal";
import { CreateProductDrawer } from "./components/CreateProductDrawer";
import { ROUTES } from "../config/routes.config";

export default function AdminProductsPage() {
  const router = useRouter();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingModalId, setDeletingModalId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

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
    clearFilters,
  } = useProductStore();

  const handleExportFile = async () => {
    setExporting(true);
    try {
      const url = await createFile();

      const link = document.createElement("a");
      link.href = url;
      link.download = "products-export.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting file:", err);
      alert("Failed to export file");
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    if (didInitialLoad.current) return;
    didInitialLoad.current = true;
    clearFilters();
    loadProducts();
  }, [loadProducts]);

  const columns = useMemo<Column<Product>[]>(
    () => [
      {
        key: "image",
        header: "Image",
        cell: (p) => (
          <img
            src={p.image_url ?? "/placeholder.png"}
            alt={p.name}
            className="w-16 h-16 object-cover rounded-md"
          />
        ),
      },
      {
        key: "name",
        header: "Name",
        className: "text-left",
        cell: (p) => (
          <span className="font-medium text-left block">{p.name}</span>
        ),
      },
      { key: "description", header: "Description", cell: (p) => p.description },
      { key: "price", header: "Price", cell: (p) => `₪${p.price}` },
      {
        key: "category",
        header: "Category",
        cell: (p) => p.category?.name ?? "-",
      },
      {
        key: "is_active",
        header: "Active",
        cell: (p) => (
          <span
            className={[
              "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
              p.is_active
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700",
            ].join(" ")}
          >
            {p.is_active ? "Active" : "Inactive"}
          </span>
        ),
      },
      { key: "stock", header: "Stock", cell: (p) => p.stock },
      {
        key: "actions",
        header: "Actions",
        className: "text-right w-[140px]",
        cell: (p) => (
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="default"
              onClick={() => {
                selectProduct(p);
                setEditingId(p.id);
              }}
              aria-label={`Edit ${p.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="default"
              onClick={() => setDeletingModalId(p.id)}
              aria-label={`Delete ${p.name}`}
            >
              <Trash2 className="h-4 w-4 text-error" />
            </Button>
          </div>
        ),
      },
    ],
    [selectProduct]
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => router.push(ROUTES.public.products)}
          className="p-1 text-text-muted hover:text-primary transition focus:outline-none"
          aria-label="Back to products"
          title="Back to products"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExportFile}
            disabled={exporting}
            className="flex items-center gap-2"
          >
            {exporting ? "Exporting..." : "Export Products"}
          </Button>

          <Button
            variant="outline"
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2"
            aria-label="Create product"
          >
            <Plus className="h-4 w-4" />
            <span>Create Product</span>
          </Button>
        </div>
      </div>

      <main className="flex-1 px-4 py-4 overflow-hidden">
        <div className="h-full">
          <Table<Product>
            columns={columns}
            rows={products}
            rowKey={(p) => p.id}
            loading={loading}
            skeletonRows={12}
            emptyTitle="No products"
            emptyDescription="Start by creating your first product"
            className="h-full"
          />
        </div>
      </main>

      <footer className="mt-auto  bottom-0 z-10 border-t border-border bg-background">
        <div className="container mx-auto px-4 py-2">
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
