import apiClient from "../apiClient";

export interface Nominee {
  nominee_id: string;
  name: string;
  description: string;
  sample_works: JSON;
  image_url: string;
  created_at: Date;
}

export interface CreateNomineeRequest {
  name: string;
  description: string;
  sample_works: JSON;
  image_url: string;
  category_ids: string;
}

export interface UpdateNomineeRequest {
  name: string;
  description: string;
  sample_works: JSON;
  image_url: string;
  category_ids: string;
}

export interface SetCategoriesRequest {
  category_ids: string;
}

export interface NomineeResponse {
  nominee_id: string;
  name: string;
  description: string;
  sample_works: JSON;
  image_url: string;
  created_at: Date;
  updated_at: Date;
  categories: CategoryBrief;
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
    updateNomineerequest: UpdateNomineeRequest
  ): Promise<NomineeResponse> {
    const response = await apiClient.put<NomineeResponse>(
      `${this.baseUrl}/${id}`,
      updateNomineerequest
    );
    return response.data;
  }

  async deleteNominee(id: string): Promise<void> {
    const response = await apiClient.delete<void>(`${this.baseUrl}/${id}`);
    return response.data;
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
}

export const nomineeService = new NomineeService();
