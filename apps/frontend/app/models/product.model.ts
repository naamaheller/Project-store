import { Category } from "./category.model";

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  is_active: boolean;
  img_url: string;
  category_id: number;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  page?: number;
  per_page?: number;
  category_id?: number[];
  min_price?: number;
  max_price?: number;
  search?: string;
}