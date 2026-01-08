import { getCategories } from "@/app/api/category.api";
import type { ApiError } from "../api/api-error";

export async function fetchCategories() {
    try {
        const response = await getCategories();
        return response.data;
    } catch (error) {
        throw error as ApiError;
    }
}