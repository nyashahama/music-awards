import apiClient from "../apiClient";

export interface Nominee {
  nominee_id: string;
  name: string;
  description: string;
  sample_works: JSON;
  image_url: string;
  created_at: Date;
  updated_at: Date;
  categories?: CategoryBrief[];
}

export interface CreateNomineeRequest {
  name: string;
  description: string;
  sample_works: JSON;
  image_url: string;
  category_ids: string[];
}

export interface UpdateNomineeRequest {
  name?: string;
  description?: string;
  sample_works?: JSON;
  image_url?: string;
  category_ids?: string[];
}

export interface SetCategoriesRequest {
  category_ids: string[];
}

export interface NomineeResponse {
  nominee_id: string;
  name: string;
  description: string;
  sample_works: JSON;
  image_url: string;
  created_at: Date;
  updated_at: Date;
  categories?: CategoryBrief[];
}

export interface CategoryBrief {
  category_id: string;
  name: string;
}

export interface NomineeBrief {
  nominee_id: string;
  name: string;
  image_url: string;
}

class NomineeService {
  private readonly baseUrl = "/nominees";

  async createNominee(
    createNomineeRequest: CreateNomineeRequest
  ): Promise<NomineeResponse> {
    const response = await apiClient.post<NomineeResponse>(
      `${this.baseUrl}`,
      createNomineeRequest
    );
    return response.data;
  }

  async updateNominee(
    id: string,
    updateNomineeRequest: UpdateNomineeRequest
  ): Promise<NomineeResponse> {
    const response = await apiClient.put<NomineeResponse>(
      `${this.baseUrl}/${id}`,
      updateNomineeRequest
    );
    return response.data;
  }

  async deleteNominee(id: string): Promise<void> {
    await apiClient.delete<void>(`${this.baseUrl}/${id}`);
  }

  async getNomineeDetails(id: string): Promise<NomineeResponse> {
    const response = await apiClient.get<NomineeResponse>(
      `${this.baseUrl}/${id}`
    );
    return response.data;
  }

  async getAllNominees(): Promise<NomineeResponse[]> {
    const response = await apiClient.get<NomineeResponse[]>(`${this.baseUrl}`);
    return response.data;
  }

  // Nominee-Category relationship methods
  async addCategory(nomineeId: string, categoryId: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${nomineeId}/categories`, {
      categoryId,
    });
  }

  async removeCategory(nomineeId: string, categoryId: string): Promise<void> {
    await apiClient.delete(
      `${this.baseUrl}/${nomineeId}/categories/${categoryId}`
    );
  }

  async setCategories(nomineeId: string, categoryIds: string[]): Promise<void> {
    await apiClient.put(`${this.baseUrl}/${nomineeId}/categories`, {
      category_ids: categoryIds,
    });
  }

  async getCategories(nomineeId: string): Promise<CategoryBrief[]> {
    const response = await apiClient.get<CategoryBrief[]>(
      `${this.baseUrl}/${nomineeId}/categories`
    );
    return response.data;
  }

  async getNomineesByCategory(categoryId: string): Promise<NomineeBrief[]> {
    const response = await apiClient.get<NomineeBrief[]>(
      `/categories/${categoryId}/nominees`
    );
    return response.data;
  }
}

export const nomineeService = new NomineeService();
