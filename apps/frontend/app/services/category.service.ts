import { getCategories } from "@/app/api/category.api";

export async function fetchCategories() {
    try {
        const response = await getCategories();
        return response.data;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
}