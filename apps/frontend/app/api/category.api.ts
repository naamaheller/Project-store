import apiClient from "./axios";
import { Category } from "@/app/models/category.model";

export interface CategoriesResponse {
    data: Category[];
}

export function getCategories() {
    return apiClient.get<Category[]>("/categories");
}