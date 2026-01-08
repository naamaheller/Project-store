import { adminAddProduct, adminDeleteProduct, adminEditProduct, getAdminProducts, getMaxPrice, getProducts } from "../api/product.api";
import { Product, ProductFilters, ProductUpsertInput } from "../models/product.model";
import type { ApiError } from "../api/api-error";

type ApiCall = (params: Record<string, any>) => Promise<{ data: any }>;

//check if role is user or admin
export function fetchProducts(filters?: ProductFilters) {
  return fetchProductsBase(getProducts, filters);

}


export function fetchAdminProducts(filters?: ProductFilters) {
  return fetchProductsBase(getAdminProducts, filters);
}

async function fetchProductsBase(apiCall: ApiCall, filters?: ProductFilters) {
  try {
    const params: any = {};

    if (filters?.page !== undefined) params.page = filters.page;
    if (filters?.per_page !== undefined) params.per_page = filters.per_page;
    if (filters?.search) params.search = filters.search;
    if (filters?.min_price !== undefined) params.min_price = filters.min_price;
    if (filters?.max_price !== undefined) params.max_price = filters.max_price;

    if (filters?.categories?.length) {
      params.categories = filters.categories;
    }

    Object.keys(params).forEach(
      (k) => params[k] === undefined && delete params[k]
    );

    const response = await apiCall(params);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error as ApiError;
  }
}

export async function fetchMaxPrice() {
  try {
    const response = await getMaxPrice();
    return response.data.max_price;
  } catch (error) {
    console.error("Error fetching max price:", error);
    throw error as ApiError;
  }
}
export const sanitizeProduct = (payload: any): Product => {
  const data = payload?.data?.product ?? payload?.product ?? payload;

  if (!data || typeof data.id === 'undefined') {
    throw new Error("Invalid product data received from server");
  }

  return data as Product;
};


export const updateProductApi = async (id: number, data: ProductUpsertInput): Promise<Product> => {
  try {
  const res = await adminEditProduct(id, data);

  if (res.status !== 200) throw new Error("Update failed");

  return sanitizeProduct(res);
  } catch (error) {
    throw error as ApiError;
  }
};
export const addProductApi = async (data: ProductUpsertInput): Promise<Product> => {
  try {
  const res = await adminAddProduct(data);

  if (res.status !== 201) throw new Error("Add product failed");
  
  return sanitizeProduct(res);
  } catch (error) {
    throw error as ApiError;
  }
};
export const deleteProductApi = async (id: number): Promise<void> => {
  try {
  const res = await adminDeleteProduct(id);
  return;
  } catch (error) {
    throw error as ApiError;
  }
};
