import apiClient from "../apiClient";

export interface Vote {
  vote_id: string;
  user_id: string;
  category_id: string;
  nominee_id: string;
  vote_type: "free" | "paid";
  created_at: string;
  updated_at: string;
}

export interface CastVoteRequest {
  category_id: string;
  nominee_id: string;
  use_paid_vote: boolean; // Changed from usePaidVote to use_paid_vote
}

export interface ChangeVoteRequest {
  nominee_id: string;
}

export interface VoteResponse {
  vote_id: string;
  user_id: string;
  category_id: string;
  nominee_id: string;
  vote_type: "free" | "paid";
  created_at: string;
  updated_at: string;
}

export interface UserVoteResponse {
  vote_id: string;
  vote_type: "free" | "paid";
  category: CategoryDetails;
  nominee: NomineeDetails;
  created_at: string;
}

export interface CategoryDetails {
  category_id: string;
  name: string;
}

export interface NomineeDetails {
  nominee_id: string;
  name: string;
  image_url: string;
}

export interface AvailableVotesResponse {
  free_votes: number;
  paid_votes: number;
  total: number;
}

export interface VoteStatsResponse {
  nominee_id: string;
  nominee_name: string;
  category_id: string;
  total_votes: number;
  free_votes: number;
  paid_votes: number;
}

export interface UserVoteSummary {
  user_id: string;
  category_id: string;
  free_votes: number;
  paid_votes: number;
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
    const response = await apiClient.get<UserVoteResponse[]>(
      `${this.baseUrl}/me`
    );
    return response.data;
  }

  async getMyVoteSummary(): Promise<UserVoteSummary[]> {
    const response = await apiClient.get<UserVoteSummary[]>(
      `${this.baseUrl}/me/summary`
    );
    return response.data;
  }

  async getAvailableVotes(): Promise<AvailableVotesResponse> {
    const response = await apiClient.get<AvailableVotesResponse>(
      `${this.baseUrl}/me/available`
    );
    return response.data;
  }

  async changeVote(
    voteId: string,
    changeVoteRequest: ChangeVoteRequest
  ): Promise<UserVoteResponse> {
    const response = await apiClient.put<UserVoteResponse>(
      `${this.baseUrl}/${voteId}`,
      changeVoteRequest
    );
    return response.data;
  }

  async deleteVote(voteId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${voteId}`);
  }

  // Admin endpoints
  async getAllVotes(): Promise<VoteResponse[]> {
    const response = await apiClient.get<VoteResponse[]>(`${this.baseUrl}/all`);
    return response.data;
  }

  async getCategoryStats(categoryId: string): Promise<VoteStatsResponse[]> {
    const response = await apiClient.get<VoteStatsResponse[]>(
      `${this.baseUrl}/category/${categoryId}/stats`
    );
    return response.data;
  }

  async getNomineeStats(nomineeId: string): Promise<VoteStatsResponse[]> {
    const response = await apiClient.get<VoteStatsResponse[]>(
      `${this.baseUrl}/nominee/${nomineeId}/stats`
    );
    return response.data;
  }
}

export const voteService = new VoteService();
