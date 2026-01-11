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

export async function getProducts<T = ProductsResponse>(params?: { page?: number; per_page?: number }) {
  try {
    const user = useAuthStore.getState().user;
    const endpoint = user?.roles.includes("admin")
      ? "/admin/products"
      : "/products";

    return await apiClient.get<T>(endpoint, { params });
  } catch (err: any) {

    throw err.apiError;
  }
}

export async function getAdminProducts(params?: { page?: number; per_page?: number }) {
  try {
    return await apiClient.get<ProductsResponse>("/admin/products", { params });
  } catch (err: any) {
    throw err.apiError;
  }

}

export async function getMaxPrice() {
  try {
    return await apiClient.get<{ max_price: number }>("/products/max-price");
  } catch (err: any) {
    throw err.apiError;
  }

}
export async function adminAddProduct(productData: ProductUpsertInput) {
  try {
    return await apiClient.post("/admin/products/add", productData);
  } catch (err: any) {
    throw err.apiError;
  }
}

export async function adminDeleteProduct(productId: number) {
  try {
    return await apiClient.delete(`/admin/products/delete/${productId}`);
  } catch (err: any) {
    throw err.apiError;
  }

}

export async function adminEditProduct(
  productId: number,
  productData: ProductUpsertInput
) {
  try {
    return await apiClient.put(`/admin/products/edit/${productId}`, productData);
  } catch (err: any) {
    throw err.apiError;
  }
}

export async function uploadAdminProductImage(productId: number, formData: FormData) {
  try {
    return await apiClient.post(`/admin/products/${productId}/image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (err: any) {
    throw err.apiError;
  }
}

export async function deleteAdminProductImage(productId: number) {
  try {
    return await apiClient.delete(`/admin/products/${productId}/image`);
  } catch (err: any) {
    throw err.apiError;
  }
}

