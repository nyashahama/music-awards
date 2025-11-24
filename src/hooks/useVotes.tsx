import { useCallback, useState } from "react";
import {
  voteService,
  CastVoteRequest,
  ChangeVoteRequest,
  VoteResponse,
  UserVoteResponse,
  AvailableVotesResponse,
  VoteStatsResponse,
  UserVoteSummary,
} from "../api/services/voteService";

interface VotesState {
  votes: UserVoteResponse[];
  availableVotes: AvailableVotesResponse | null;
  isLoading: boolean;
}

export interface UseVotesReturn {
  votes: VotesState;
  castVote: (data: CastVoteRequest) => Promise<UserVoteResponse>;
  getUserVotes: () => Promise<void>;
  getMyVoteSummary: () => Promise<UserVoteSummary[]>;
  getAvailableVotes: () => Promise<void>;
  changeVote: (
    voteId: string,
    data: ChangeVoteRequest
  ) => Promise<UserVoteResponse>;
  deleteVote: (voteId: string) => Promise<void>;
  getCategoryStats: (categoryId: string) => Promise<VoteStatsResponse[]>;
  getNomineeStats: (nomineeId: string) => Promise<VoteStatsResponse[]>;
  getAllVotes: () => Promise<VoteResponse[]>;
  clearError: () => void;
  clearVotes: () => void;
  error: string | null;
}

export const useVotes = (): UseVotesReturn => {
  const [votes, setVotes] = useState<VotesState>({
    votes: [],
    availableVotes: null,
    isLoading: false,
  });

  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const clearVotes = useCallback(() => {
    setVotes({
      votes: [],
      availableVotes: null,
      isLoading: false,
    });
  }, []);

  const castVote = useCallback(
    async (data: CastVoteRequest): Promise<UserVoteResponse> => {
      setVotes((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await voteService.castVote(data);
        setVotes((prev) => ({
          ...prev,
          votes: [...prev.votes, response],
          isLoading: false,
        }));
        // Refresh available votes after casting
        await getAvailableVotes();
        return response;
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to cast vote";
        setError(msg);
        setVotes((prev) => ({ ...prev, isLoading: false }));
        throw err;
      }
    },
    []
  );

  const getUserVotes = useCallback(async () => {
    setVotes((prev) => ({ ...prev, isLoading: true }));
    try {
      const userVotes = await voteService.getUserVotes();
      setVotes((prev) => ({
        ...prev,
        votes: userVotes,
        isLoading: false,
      }));
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to fetch user votes";
      setError(msg);
      setVotes((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const getMyVoteSummary = useCallback(async (): Promise<UserVoteSummary[]> => {
    try {
      return await voteService.getMyVoteSummary();
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to fetch vote summary";
      setError(msg);
      throw err;
    }
  }, []);

  const getAvailableVotes = useCallback(async () => {
    setVotes((prev) => ({ ...prev, isLoading: true }));
    try {
      const available = await voteService.getAvailableVotes();
      setVotes((prev) => ({
        ...prev,
        availableVotes: available,
        isLoading: false,
      }));
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ?? "Failed to fetch available votes";
      setError(msg);
      setVotes((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const changeVote = useCallback(
    async (
      voteId: string,
      data: ChangeVoteRequest
    ): Promise<UserVoteResponse> => {
      setVotes((prev) => ({ ...prev, isLoading: true }));
      try {
        const updated = await voteService.changeVote(voteId, data);
        // Refresh user votes after changing
        await getUserVotes();
        setVotes((prev) => ({ ...prev, isLoading: false }));
        return updated;
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to change vote";
        setError(msg);
        setVotes((prev) => ({ ...prev, isLoading: false }));
        throw err;
      }
    },
    []
  );

  const deleteVote = useCallback(async (voteId: string) => {
    setVotes((prev) => ({ ...prev, isLoading: true }));
    try {
      await voteService.deleteVote(voteId);
      setVotes((prev) => ({
        ...prev,
        votes: prev.votes.filter((v) => v.vote_id !== voteId),
        isLoading: false,
      }));
      // Refresh available votes after deleting
      await getAvailableVotes();
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to delete vote";
      setError(msg);
      setVotes((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const getCategoryStats = useCallback(
    async (categoryId: string): Promise<VoteStatsResponse[]> => {
      try {
        return await voteService.getCategoryStats(categoryId);
      } catch (err: any) {
        const msg =
          err?.response?.data?.error ?? "Failed to fetch category stats";
        setError(msg);
        throw err;
      }
    },
    []
  );

  const getNomineeStats = useCallback(
    async (nomineeId: string): Promise<VoteStatsResponse[]> => {
      try {
        return await voteService.getNomineeStats(nomineeId);
      } catch (err: any) {
        const msg =
          err?.response?.data?.error ?? "Failed to fetch nominee stats";
        setError(msg);
        throw err;
      }
    },
    []
  );

  const getAllVotes = useCallback(async (): Promise<VoteResponse[]> => {
    try {
      return await voteService.getAllVotes();
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to fetch all votes";
      setError(msg);
      throw err;
    }
  }, []);

  return {
    votes,
    castVote,
    getUserVotes,
    getMyVoteSummary,
    getAvailableVotes,
    changeVote,
    deleteVote,
    getCategoryStats,
    getNomineeStats,
    getAllVotes,
    clearError,
    clearVotes,
    error,
  };
};
