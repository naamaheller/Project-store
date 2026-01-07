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



export function getProducts<T= ProductsResponse>(params?: { page?: number; per_page?: number }) {
 
  const user = useAuthStore.getState().user;
  const endpoint = user?.role === "admin" 
    ? "/admin/products" 
    : "/products";

  return apiClient.get<T>(endpoint, { params });
  // return apiClient.get<ProductsResponse>("/products", { params });
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
  productData: FormData
) {
  return apiClient.put(`/admin/products/edit/${productId}`, productData);
}
