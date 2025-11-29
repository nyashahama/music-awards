import apiClient from "../apiClient";

export interface Category {
  category_id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Extended fields for UI (optional, may come from separate endpoint)
  slug?: string;
  icon?: string;
  nomineesCount?: number;
  votesCount?: number;
  startDate?: string;
  endDate?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
}

export interface CategoryResponse {
  category_id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Include optional extended fields
  slug?: string;
  icon?: string;
  nomineesCount?: number;
  votesCount?: number;
  startDate?: string;
  endDate?: string;
}

class CategoryService {
  private readonly baseUrl = "/categories";

  async createCategory(
    categoryRequest: CreateCategoryRequest
  ): Promise<CategoryResponse> {
    const response = await apiClient.post<CategoryResponse>(
      this.baseUrl,
      categoryRequest
    );
    return response.data;
  }

  async updateCategory(
    id: string,
    updateCategory: UpdateCategoryRequest
  ): Promise<CategoryResponse> {
    const response = await apiClient.put<CategoryResponse>(
      `${this.baseUrl}/${id}`,
      updateCategory
    );
    return response.data;
  }

  async deleteCategory(id: string): Promise<void> {
    await apiClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  async getCategory(id: string): Promise<CategoryResponse> {
    const response = await apiClient.get<CategoryResponse>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  async listCategories(): Promise<CategoryResponse[]> {
    const response = await apiClient.get<CategoryResponse[]>(`${this.baseUrl}`);
    return response.data;
  }

  async listActiveCategories(): Promise<CategoryResponse[]> {
    const response = await apiClient.get<CategoryResponse[]>(
      `${this.baseUrl}/active`
    );
    return response.data;
  }
}

export const categoryService = new CategoryService();
