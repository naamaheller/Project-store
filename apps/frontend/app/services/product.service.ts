import {getProducts, getAdminProducts } from '@/app/api/product.api';

export async function fetchProducts(options?: { page?: number; per_page?: number }) {
  const response = await getProducts(
    { page: options?.page, 
      per_page: options?.per_page }
  );
  return response.data;
}

export async function fetchAdminProducts(options?: { page?: number; per_page?: number }) {
  const response = await getAdminProducts(
    { page: options?.page, 
      per_page: options?.per_page }
  );
  return response.data;
}