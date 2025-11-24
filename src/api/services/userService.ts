import apiClient from "../apiClient";

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  location: string;
  free_votes: number;
  paid_votes: number;
  total_votes: number;
  created_at: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  location: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  location?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ValidateResetTokenRequest {
  token: string;
}

export interface ValidateResetTokenResponse {
  valid: boolean;
  email: string;
}

export interface PasswordResetResponse {
  message: string;
  token?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class UserService {
  private readonly usersPath = "/profile";
  private readonly auth = "/auth";

  // Auth endpoints
  async register(
    registerRequest: RegisterRequest
  ): Promise<{ user: User; token: string }> {
    const response = await apiClient.post<{ user: User; token: string }>(
      `${this.auth}/register`,
      registerRequest
    );
    return response.data;
  }

  async login(loginRequest: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      `${this.auth}/login`,
      loginRequest
    );
    return response.data;
  }

  async forgotPassword(
    forgotPasswordRequest: ForgotPasswordRequest
  ): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `${this.auth}/forgot-password`,
      forgotPasswordRequest
    );
    return response.data;
  }

  async resetPassword(
    resetPasswordRequest: ResetPasswordRequest
  ): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `${this.auth}/reset-password`,
      resetPasswordRequest
    );
    return response.data;
  }

  async validateResetToken(token: string): Promise<ValidateResetTokenResponse> {
    const response = await apiClient.post<ValidateResetTokenResponse>(
      `${this.auth}/validate-reset-token`,
      { token }
    );
    return response.data;
  }

  // User endpoints (require authentication)
  async getAllUsers(): Promise<User[]> {
    const response = await apiClient.get<User[]>(this.usersPath);
    return response.data;
  }

  async getProfile(id: string): Promise<User> {
    const response = await apiClient.get<User>(`${this.usersPath}/${id}`);
    return response.data;
  }

  async updateProfile(
    id: string,
    updateData: UpdateProfileRequest
  ): Promise<User> {
    const response = await apiClient.put<User>(
      `${this.usersPath}/${id}`,
      updateData
    );
    return response.data;
  }

  async deleteAccount(id: string): Promise<void> {
    await apiClient.delete(`${this.usersPath}/${id}`);
  }

  async promoteUser(id: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      `${this.usersPath}/${id}/promote`
    );
    return response.data;
  }
}

export const userService = new UserService();
