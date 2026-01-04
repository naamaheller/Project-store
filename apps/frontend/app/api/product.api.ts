import apiClient from "./axios";
import { Product } from "@/app/models/product.model";

export interface ProductsResponse {
  data: Product[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export function getProducts(params?: { page?: number; per_page?: number }) {
  return apiClient.get<ProductsResponse>("/products", { params });
}

export function getAdminProducts(params?: { page?: number; per_page?: number }) {
  return apiClient.get<ProductsResponse>("/admin/products", { params });
}

export function getMaxPrice() {
  return apiClient.get<{ max_price: number }>("/products/max-price");
}