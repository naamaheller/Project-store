import { create } from "zustand";
import { Product, ProductUpsertInput } from "@/app/models/product.model";
import ProductFiltersState from "@/app/models/product-filters.model";
import {
  addProductApi,
  deleteProductApi,
  fetchMaxPrice,
  fetchProducts,
  updateProductApi,
} from "@/app/services/product.service";
import { Category } from "../models/category.model";
import { fetchCategories } from "../services/category.service";
import { uploadProductImage as uploadProductImageService } from "@/app/services/product-image.service";
import { deleteProductImage as deleteProductImageService } from "@/app/services/product-image.service";
import { toastRef } from "../components/ui/Toast";

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
  hasFetched: boolean;

  categories: Category[];
  loadingCategories: boolean;
  loadingMaxPrice: boolean;

  deletingId: number | null;
  saving: boolean;

  updateProduct: (id: number, data: ProductUpsertInput) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  createProduct: (data: any) => Promise<Product>;

  uploadProductImage: (productId: number, file: File) => Promise<void>;
  deleteProductImage: (productId: number) => Promise<void>;
  resetStore: () => void;

  setPage: (page: number) => Promise<void>;
  setPageSize: (size: number) => Promise<void>;
  setFilters: (filters: Partial<ProductFiltersState>) => void;
  loadProducts: () => Promise<void>;
  loadFiltersData: () => Promise<void>;
  applyFilters: () => Promise<void>;
  clearFilters: () => Promise<void>;
  clearSelectedProduct: () => void;
  selectProduct: (product: Product | null) => void;
};

const hasActiveFilters = (
  filters: ProductFiltersState,
  absoluteMaxPrice: number
) =>
  !!filters.search ||
  filters.categories.length > 0 ||
  filters.minPrice !== null ||
  (filters.maxPrice !== null &&
    absoluteMaxPrice > 0 &&
    filters.maxPrice < absoluteMaxPrice);

const initialProductState = {
  products: [],
  selectedProduct: null,

  page: 1,
  pageSize: 12,
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
  hasFetched: false,

  categories: [],
  loadingCategories: false,
  loadingMaxPrice: false,
  deletingId: null,
  saving: false,
};

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  selectedProduct: null,

  page: 1,
  pageSize: 12,
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
  hasFetched: false,

  categories: [],
  loadingCategories: false,
  loadingMaxPrice: false,

  deletingId: null,
  saving: false,

  setPage: async (page) => {
    set({ page });
    set({filtersApplied: true});
    await get().loadProducts();
  },

  setPageSize: async (pageSize) => {
    set({ pageSize, page: 1 });
    set({filtersApplied: true});
    await get().loadProducts();
  },

  setFilters: (partial) =>
    set((state) => ({
      filters: { ...state.filters, ...partial },
    })),

  selectProduct: (product) => set({ selectedProduct: product }),
  clearSelectedProduct: () => set({ selectedProduct: null }),

  loadProducts: async () => {
    const { loading, page, pageSize, filters, products, filtersApplied } =
      get();
    if (loading) return;
    if (!filtersApplied && products.length > 0) return;

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
        hasFetched: true,
      });
    } finally {
      set({ loading: false });
    }
  },

  applyFilters: async () => {
    const { filters, absoluteMaxPrice } = get();

    set({
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
        maxPrice: null,
        categories: [],
      },
      filtersApplied: false,
      page: 1,
      products: [],
    });

    await get().loadProducts();
  },

  loadFiltersData: async () => {
    const { loadingCategories, loadingMaxPrice, categories, absoluteMaxPrice } =
      get();
    if (
      loadingCategories ||
      loadingMaxPrice ||
      categories.length > 0 ||
      absoluteMaxPrice > 0
    ) {
      return;
    }

    try {
      set({ loadingCategories: true, loadingMaxPrice: true });

      const [categories, maxPrice] = await Promise.all([
        fetchCategories(),
        fetchMaxPrice(),
      ]);

      set((state) => ({
        categories,
        absoluteMaxPrice: maxPrice,
      }));
    } catch (e) {
      console.error("Failed to load filters data", e);
    } finally {
      set({ loadingCategories: false, loadingMaxPrice: false });
    }
  },

  deleteProduct: async (id: number) => {
    try {
      set({ deletingId: id });
      await deleteProductApi(id);
      const product = get().products.find((p) => p.id === id) ?? null;
      const hasImage = !!(product?.img_url || product?.image_url);

      if (hasImage) {
        try {
          await get().deleteProductImage(id);
        } catch (e) {
          console.warn(
            "Image delete failed, continuing to delete product...",
            e
          );
        }
      }
      toastRef.success("Product deleted successfully", "Deleted");
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
        total: Math.max(0, state.total - 1),
        selectedProduct:
          state.selectedProduct?.id === id ? null : state.selectedProduct,
      }));
      const { products, page, pageSize, total } = get();
      if (products.length === 0 && page > 1) {
        await get().setPage(page - 1);
        return;
      }
      const shouldHaveMore = total > (page - 1) * pageSize + products.length;
      console.log({ total, productsLength: (page - 1) * pageSize + products.length });
      if (shouldHaveMore && products.length < pageSize) {
        console.log("Loading more products to fill the page...");
        set({ filtersApplied: true }); 
        await get().loadProducts();
      }
    } catch (e) {
    } finally {
      set({ deletingId: null });
    }
  },

  createProduct: async (data) => {
    set({ saving: true });
    try {
      const created = await addProductApi(data);
      toastRef.success("Product created successfully", "Created");
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

  updateProduct: async (id: number, data: ProductUpsertInput) => {
    set({ saving: true });
    try {
      const updated: Product = await updateProductApi(id, data);
      toastRef.success("Product updated successfully", "Updated");
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

  uploadProductImage: async (productId, file) => {
    const uploadRes = await uploadProductImageService(productId, file);

    const path: string | null = uploadRes?.path ?? null;
    const url: string | null = uploadRes?.url ?? null;

    set((state) => {
      const nextSelected =
        state.selectedProduct?.id === productId
          ? {
              ...state.selectedProduct,
              img_url: path ?? state.selectedProduct.img_url,
              image_url: url ?? state.selectedProduct.image_url,
            }
          : state.selectedProduct;

      const nextProducts = state.products.map((p) =>
        p.id === productId
          ? {
              ...p,
              img_url: path ?? p.img_url,
              image_url: url ?? p.image_url,
            }
          : p
      );

      return {
        selectedProduct: nextSelected,
        products: nextProducts,
      };
    });
  },
  deleteProductImage: async (productId) => {
    await deleteProductImageService(productId);

    set((state) => {
      const nextSelected =
        state.selectedProduct?.id === productId
          ? { ...state.selectedProduct, img_url: null, image_url: null }
          : state.selectedProduct;

      const nextProducts = state.products.map((p) =>
        p.id === productId ? { ...p, img_url: null, image_url: null } : p
      );

      return { selectedProduct: nextSelected, products: nextProducts };
    });
  },
  resetStore: () => set(() => ({ ...initialProductState })),
}));
