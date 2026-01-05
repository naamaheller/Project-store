"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

import { fetchAdminProducts } from "@/app/services/product.service";
import { Product } from "@/app/models/product.model";

import { Table } from "@/app/components/ui/Table";
import { Button } from "@/app/components/ui/Button";
import { Skeleton } from "@/app/components/ui/Skeleton";
import { EmptyState } from "@/app/components/ui/EmptyState";
import { Pagination } from "@/app/components/ui/Pagination";

export default function AdminProductsPage() {
  const router = useRouter();

  // State for data management
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loadingPage, setLoadingPage] = useState(true);

 
  const loadProducts = useCallback(async () => {
    try {
      setLoadingPage(true);
      const res = await fetchAdminProducts({
        page,
        per_page: pageSize,
      });
      console.log(res.data);
      setProducts(res.data);
      console.log(products);
      setTotal(res.total);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoadingPage(false);
    }
  }, [page, pageSize]);

  // Only trigger based on pagination changes
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <div className="flex flex-col min-h-screen gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>

        <Button onClick={() => router.push("/admin/products/create")}>
          + Add Product
        </Button>
      </div>

      {/* Table Content */}
      {loadingPage ? (
        <Skeleton className="h-72 w-full" />
      ) : products.length === 0 ? (
        <EmptyState
          title="No products"
          description="Start by creating your first product"
        />
      ) : (
        <>
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Th>ID</Table.Th>
                <Table.Th>Name</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th align="right">Actions</Table.Th>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              {products.map((p) => (
                <Table.Row key={p.id}>
                  <Table.Td>{p.id}</Table.Td>
                  <Table.Td className="font-medium">{p.name}</Table.Td>
                  <Table.Td>₪{p.price}</Table.Td>
                  <Table.Td>{p.category?.name ?? "-"}</Table.Td>
                  <Table.Td align="right" className="space-x-2">
                    <Button size="sm" variant="outline" onClick={() => router.push(`/admin/products/${p.id}/edit`)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive">
                      Delete
                    </Button>
                  </Table.Td>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {/* Pagination Component */}
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
        </>
      )}
    </div>
  );
}