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
  category_id: Category;
  created_at: string;
  updated_at: string;
}
