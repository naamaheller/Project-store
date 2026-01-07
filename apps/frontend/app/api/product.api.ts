import apiClient from "./axios";
import { Product, ProductUpsertInput } from "@/app/models/product.model";
import { useAuthStore } from "@/app/store/auth.store";


export interface ProductsResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export function getProducts<T = ProductsResponse>(params?: { page?: number; per_page?: number }) {

  const user = useAuthStore.getState().user;
  const endpoint = user?.roles.includes("admin")
    ? "/admin/products"
    : "/products";

  return apiClient.get<T>(endpoint, { params });
}

export function getAdminProducts(params?: { page?: number; per_page?: number }) {
  return apiClient.get<ProductsResponse>("/admin/products", { params });
}

export function getMaxPrice() {
  return apiClient.get<{ max_price: number }>("/products/max-price");
}
export function adminAddProduct(productData: ProductUpsertInput) {
  return apiClient.post("/admin/products/add", productData, );
}

export function adminDeleteProduct(productId: number) {
  return apiClient.delete(`/admin/products/delete/${productId}`);
}

export function adminEditProduct(
  productId: number,
  productData: ProductUpsertInput
) {
  return apiClient.put(`/admin/products/edit/${productId}`, productData);
}

export function uploadAdminProductImage(productId: number, formData: FormData) {
  return apiClient.post(`/admin/products/${productId}/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function deleteAdminProductImage(productId: number) {
  return apiClient.delete(`/admin/products/${productId}/image`);
}

