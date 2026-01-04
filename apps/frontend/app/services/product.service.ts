import { getAdminProducts, getMaxPrice, getProducts } from "../api/product.api";
import { ProductFilters } from "../models/product.model";

type ApiCall = (params: Record<string, any>) => Promise<{ data: any }>;

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
    throw error;
  }
}

export async function fetchMaxPrice() {
  try {
    const response = await getMaxPrice();
    return response.data.max_price;
  } catch (error) {
    console.error("Error fetching max price:", error);
    throw error;
  }
}
