import { ApiError } from "../api/api-error";
import { createProductFile } from "../api/files.api";

type ApiCall = (params: Record<string, any>) => Promise<{ data: any }>;

export async function createFile() {
  try {
    const response = await createProductFile();
    return response.data.url;
  } catch (error) {
    console.error("Error fetching max price:", error);
    throw error as ApiError;
  }
}
