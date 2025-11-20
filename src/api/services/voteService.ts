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

export interface ChangeVoteRequest {
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

export interface AvailableVotesResponse {
  available_votes: number;
}

class VoteService {
  private readonly baseUrl = "/votes";

  async castVote(castVoteRequest: CastVoteRequest): Promise<UserVoteResponse> {
    const response = await apiClient.post<UserVoteResponse>(
      `${this.baseUrl}`,
      castVoteRequest
    );
    return response.data;
  }

  async getUserVotes(): Promise<UserVoteResponse[]> {
    const response = await apiClient.get<UserVoteResponse[]>(`${this.baseUrl}`);
    return response.data;
  }

  async getAvailableVotes(): Promise<number> {
    const response = await apiClient.get<AvailableVotesResponse>(
      `${this.baseUrl}/available`
    );
    return response.data.available_votes;
  }

  async changeVote(
    voteId: string,
    changeVoteRequest: ChangeVoteRequest
  ): Promise<VoteResponse> {
    const response = await apiClient.put<VoteResponse>(
      `${this.baseUrl}/${voteId}`,
      changeVoteRequest
    );
    return response.data;
  }

  async deleteVote(voteId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${voteId}`);
  }

  // Admin endpoints
  async getCategoryVotes(categoryId: string): Promise<VoteResponse[]> {
    const response = await apiClient.get<VoteResponse[]>(
      `${this.baseUrl}/category/${categoryId}`
    );
    return response.data;
  }

  async getAllVotes(): Promise<VoteResponse[]> {
    const response = await apiClient.get<VoteResponse[]>(`${this.baseUrl}/all`);
    return response.data;
  }
}

export const voteService = new VoteService();
