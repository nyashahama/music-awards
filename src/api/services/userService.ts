import apiClient from "../apiClient";

interface User {
  user_id: string,
  username: string,
  email: string,
  role: string,
  available_votes: number,
  created_at: Date
}
class UserService {
  private readonly basePath = '/users';

  async getAll(): Promise<User[]> {
    const response = await apiClient.get<User[]>(this.basePath);
    return response.data;
  }

  async getById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`${this.basePath}/${id}`);
    return response.data;
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const response = await apiClient.post<User>(this.basePath, user);
    return response.data;
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const response = await apiClient.put<User>(`${this.basePath}/${id}`, user);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.basePath}/${id}`);
  }
}

export const userService = UserService;
