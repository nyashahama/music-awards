import apiClient from "../apiClient";

export interface Vote {
  vote_id: string;
  user_id: string;
  category_id: string;
  nominee_id: string;
  created_at: string;
}

export interface CastVoteRequest {
  category_id: string;
  nominee_id: string;
}

export interface VoteResponse {
  vote_id: string;
  user_id: string;
  category_id: string;
  nominee_id: string;
  created_at: Date;
}

export interface UserVoteResponse {
  vote_id: string;
  category: CategoryDetails;
  nominee: NomineeDetails;
  created_at: Date;
}

export interface CategoryDetails {
  id: string;
  name: string;
}

export interface NomineeDetails {
  id: string;
  name: string;
}

class VoteService {
  private readonly baseUrl = "/votes";

  async castVote(castVoteRequest: CastVoteRequest): Promise<VoteResponse> {
    const response = await apiClient.post<VoteResponse>(
      `${this.baseUrl}`,
      castVoteRequest
    );
    return response.data;
  }

  async getUserVotes(user_id: string): Promise<VoteResponse[]> {
    const response = await apiClient.get<VoteResponse[]>(
      `${this.baseUrl}/${user_id}`
    );
    return response.data;
  }

  async getAvailableVotes(): Promise<number> {
    const response = await apiClient.get<number>(`${this.baseUrl}/available`);
    return response.data;
  }

  async getCategoryVotes(category_id: string): Promise<VoteResponse> {
    const response = await apiClient.get<VoteResponse>(
      `${this.baseUrl}/category/${category_id}`
    );
    return response.data;
  }

  async getAllVotes(): Promise<VoteResponse[]> {
    const response = await apiClient.get<VoteResponse[]>(`${this.baseUrl}`);
    return response.data;
  }
}

export const voteService = new VoteService();
