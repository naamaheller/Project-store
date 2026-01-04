import { getProducts, getAdminProducts } from "@/app/api/product.api";

export async function fetchProducts(options?: {
  page?: number;
  per_page?: number;
}) {
  try {
    const response = await getProducts({
      page: options?.page,
      per_page: options?.per_page,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function fetchAdminProducts(options?: {
  page?: number;
  per_page?: number;
}) {
  try {
    const response = await getAdminProducts({
      page: options?.page,
      per_page: options?.per_page,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching admin products:", error);
    throw error;
  }
}
