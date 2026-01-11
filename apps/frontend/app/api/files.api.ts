import { useAuthStore } from "../store/auth.store";
import apiClient from "./axios";

export interface FilesResponse {
  massage: string;
  url: string;
}

export async function createProductFile<T = FilesResponse>() {
  try {
    const user = useAuthStore.getState().user;
    const endpoint = user?.roles.includes("admin")
      ? "admin/products/export"
      : "/products";

    return await apiClient.post<T>(endpoint);
  } catch (err: any) {
    throw err.apiError;
  }
}
