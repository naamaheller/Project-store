import apiClient from "./axios";
import { Category } from "@/app/models/category.model";

export interface CategoriesResponse {
    data: Category[];
}

export async function getCategories() {
    try {
        return await apiClient.get<Category[]>("/categories");
    } catch (err: any) {
        throw err.apiError; 
    }
    
}