import { useCallback, useState } from "react";
import {
  Category,
  categoryService,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../api/services/categoryService";

interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
}

export interface UseCategoriesReturn {
  categories: CategoriesState;
  createCategory: (data: CreateCategoryRequest) => Promise<void>;
  updateCategory: (id: string, data: UpdateCategoryRequest) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategory: (id: string) => Promise<Category>;
  listCategories: () => Promise<void>;
  listActiveCategories: () => Promise<void>;

  clearError: () => void;
  clearCategories: () => void;
}

/* ---------- Hook Implementation ---------- */
export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<CategoriesState>({
    categories: [],
    isLoading: false,
  });

  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const clearCategories = useCallback(() => {
    setCategories({
      categories: [],
      isLoading: false,
    });
  }, []);

  const createCategory = useCallback(async (data: CreateCategoryRequest) => {
    setCategories((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await categoryService.createCategory(data);
      // Add the new category to the state
      setCategories((prev) => ({
        ...prev,
        categories: [...prev.categories, response],
        isLoading: false,
      }));
      console.log("Category created successfully", response.name);
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to create category";
      setError(msg);
      setCategories((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const updateCategory = useCallback(
    async (id: string, data: UpdateCategoryRequest) => {
      setCategories((prev) => ({ ...prev, isLoading: true }));
      try {
        const updated = await categoryService.updateCategory(id, data);
        setCategories((prev) => ({
          ...prev,
          categories: prev.categories.map((x) =>
            x.category_id === id ? updated : x
          ),
          isLoading: false,
        }));
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to update category";
        setError(msg);
        setCategories((prev) => ({ ...prev, isLoading: false }));
        throw err;
      }
    },
    []
  );

  const deleteCategory = useCallback(async (id: string) => {
    setCategories((prev) => ({ ...prev, isLoading: true }));
    try {
      await categoryService.deleteCategory(id);
      setCategories((prev) => ({
        ...prev,
        categories: prev.categories.filter((u) => u.category_id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to delete category";
      setError(msg);
      setCategories((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const getCategory = useCallback(async (id: string) => {
    setCategories((prev) => ({ ...prev, isLoading: true }));
    try {
      const category = await categoryService.getCategory(id);
      setCategories((prev) => ({ ...prev, isLoading: false }));
      return category;
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to fetch category";
      setError(msg);
      setCategories((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const listCategories = useCallback(async () => {
    setCategories((prev) => ({ ...prev, isLoading: true }));
    try {
      const categoriesList = await categoryService.listCategories();
      setCategories({
        categories: categoriesList,
        isLoading: false,
      });
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to fetch categories";
      setError(msg);
      setCategories((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const listActiveCategories = useCallback(async () => {
    setCategories((prev) => ({ ...prev, isLoading: true }));
    try {
      const activeCategories = await categoryService.listActiveCategories();
      setCategories({
        categories: activeCategories,
        isLoading: false,
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ?? "Failed to fetch active categories";
      setError(msg);
      setCategories((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  return {
    categories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    listCategories,
    listActiveCategories,
    clearError,
    clearCategories,
  };
};
