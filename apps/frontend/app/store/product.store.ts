import { create } from "zustand";
import { Product,ProductUpsertInput } from "@/app/models/product.model";
import ProductFiltersState from "@/app/models/product-filters.model";
import { fetchMaxPrice, fetchProducts } from "@/app/services/product.service";
import { Category } from "../models/category.model";
import { fetchCategories } from "../services/category.service";
import { adminAddProduct, adminDeleteProduct, adminEditProduct } from "../api/product.api";
const normalizeProduct = (payload: any): Product =>
  payload?.data?.product ?? payload?.product ?? payload;
type ProductStore = {
  products: Product[];
  selectedProduct: Product | null;

  page: number;
  pageSize: number;
  total: number;

  filters: ProductFiltersState;
  filtersApplied: boolean;
  absoluteMaxPrice: number;

  loading: boolean;
  
  categories: Category[];
  loadingCategories: boolean;
  loadingMaxPrice: boolean;
  deletingId: number | null;
  saving: boolean;
  updateProduct: (id: number, data: ProductUpsertInput) => Promise<Product>;

  

  setPage: (page: number) => Promise<void>;
  setPageSize: (size: number) => Promise<void>;
  setFilters: (filters: Partial<ProductFiltersState>) => void;

  loadProducts: () => Promise<void>;
  loadProductById: (id: number) => Promise<void>;
  loadFiltersData: () => Promise<void>;
  createProduct: (data: any) => Promise<Product>;
  applyFilters: () => Promise<void>;
  clearFilters: () => Promise<void>;
  clearSelectedProduct: () => void;
  selectProduct: (product: Product | null) => void;
  deleteProduct: (id: number) => Promise<void>;
};

const hasActiveFilters = (filters: ProductFiltersState, absoluteMaxPrice: number) =>
  !!filters.search ||
  filters.categories.length > 0 ||
  filters.minPrice !== null ||
  (filters.maxPrice !== null && absoluteMaxPrice > 0 && filters.maxPrice < absoluteMaxPrice);

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  selectedProduct: null,

  page: 1,
  pageSize: 5,
  total: 0,

  filters: {
    search: "",
    minPrice: null,
    maxPrice: null,
    categories: [],
  },

  filtersApplied: false,
  absoluteMaxPrice: 0,

  loading: false,

  categories: [],
  loadingCategories: false,
  loadingMaxPrice: false,
  


  setPage: async (page) => {
    set({ page });
    await get().applyFilters();
  },

  setPageSize: async (pageSize) => {
    set({ pageSize, page: 1 });
    await get().applyFilters();
  },

  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),

  selectProduct: (product) => set({ selectedProduct: product }),

  loadProducts: async () => {
    const { loading, page, pageSize, filters } = get();
    if (loading) return;
    console.log("FETCH PRODUCTS");

    try {
      set({ loading: true });

      const result = await fetchProducts({
        page,
        per_page: pageSize,
        search: filters.search,
        min_price: filters.minPrice ?? undefined,
        max_price: filters.maxPrice ?? undefined,
        categories: filters.categories,
      });

      set({
        products: result.data,
        total: result.total,
      });
    } finally {
      set({ loading: false });
    }
  },

  applyFilters: async () => {
    const { filters, absoluteMaxPrice } = get();

    set({
      // page: 1,
      filtersApplied: hasActiveFilters(filters, absoluteMaxPrice),
    });

    await get().loadProducts();
  },

  clearFilters: async () => {
    const max = get().absoluteMaxPrice;

    set({
      filters: {
        search: "",
        minPrice: null,
        maxPrice: max > 0 ? max : null,
        categories: [],
      },
      filtersApplied: false,
      page: 1,
    });

    await get().loadProducts();
  },
  loadProductById: async (id: number) => {
    set({ loading: true });

    const res = await fetch(`/api/admin/products/${id}`);
    const product = await res.json();

    set({
      selectedProduct: product,
      loading: false,
    });
  },

  loadFiltersData: async () => {
    try {
      set({ loadingCategories: true, loadingMaxPrice: true });

      const [categories, maxPrice] = await Promise.all([
        fetchCategories(),
        fetchMaxPrice(),
      ]);

      set((state) => ({
        categories,
        absoluteMaxPrice: maxPrice,
        filters: {
          ...state.filters,
          maxPrice: state.filters.maxPrice ?? maxPrice,
        },
      }));
    } catch (e) {
      console.error("Failed to load filters data", e);
    } finally {
      set({ loadingCategories: false, loadingMaxPrice: false });
    }
  },
    clearSelectedProduct: () => set({ selectedProduct: null }),
    deletingId: null,

    deleteProduct: async (id: number) => {
      try {
    set({ deletingId: id });

    const res = await adminDeleteProduct(id);
    console.log("Delete response:", res);
    if (res.status !== 200) {
      throw new Error("Failed to delete product");
    }

  set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        total: Math.max(0, state.total - 1),
        selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
      }));
  } finally {
    set({ deletingId: null });
  }
},
createProduct: async (data) => {
  set({ saving: true });
  try {
    const res = await adminAddProduct(data);

    if (res.status !== 201) {
      const text = await res.text().catch(() => "");
      throw new Error(text || "Failed to create product");
    }



    const created: Product = normalizeProduct(res);

      set((state) => {
      const next = [created, ...state.products];
      
      const capped = next.slice(0, state.pageSize);

      return {
        selectedProduct: created,
        products: capped,
        total: state.total + 1,
      };
    });

    return created;
  } finally {
    set({ saving: false });
  }
},

  saving: false,
  updateProduct: async (id, data) => {
    set({ saving: true });

    try {
     
      const res = await adminEditProduct(id, data);
      console.log("Updated product:", res);
  
      const updated: Product = normalizeProduct(res);
      console.log("Updated product:", updated);
    set((state) => {
      const exists = state.products.some((p) => p.id === updated.id);

      return {
        selectedProduct: updated,
        products: exists
          ? state.products.map((p) => (p.id === updated.id ? updated : p))
          : [updated, ...state.products], 
      };
    });

    return updated;
  
    } finally {
      set({ saving: false });
    }
  },


}));
