type ProductFiltersState = {
  search: string;
  minPrice: number | null;
  maxPrice: number | null;
  categories: number[];
};
export default ProductFiltersState;