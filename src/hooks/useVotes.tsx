import { useCallback, useState } from "react";
import {
  voteService,
  CastVoteRequest,
  ChangeVoteRequest,
  VoteResponse,
  UserVoteResponse,
} from "../api/services/voteService";

interface VotesState {
  votes: UserVoteResponse[];
  availableVotes: number;
  isLoading: boolean;
}

export interface UseVotesReturn {
  votes: VotesState;
  castVote: (data: CastVoteRequest) => Promise<UserVoteResponse>;
  getUserVotes: () => Promise<void>;
  getAvailableVotes: () => Promise<void>;
  changeVote: (
    voteId: string,
    data: ChangeVoteRequest
  ) => Promise<VoteResponse>;
  deleteVote: (voteId: string) => Promise<void>;
  getCategoryVotes: (categoryId: string) => Promise<VoteResponse[]>;
  getAllVotes: () => Promise<VoteResponse[]>;
  clearError: () => void;
  clearVotes: () => void;
  error: string | null;
}

export const useVotes = (): UseVotesReturn => {
  const [votes, setVotes] = useState<VotesState>({
    votes: [],
    availableVotes: 0,
    isLoading: false,
  });

  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const clearVotes = useCallback(() => {
    setVotes({
      votes: [],
      availableVotes: 0,
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
          availableVotes: Math.max(0, prev.availableVotes - 1),
          isLoading: false,
        }));
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
    async (voteId: string, data: ChangeVoteRequest): Promise<VoteResponse> => {
      setVotes((prev) => ({ ...prev, isLoading: true }));
      try {
        const updated = await voteService.changeVote(voteId, data);
        setVotes((prev) => ({ ...prev, isLoading: false }));
        // Refresh user votes after changing
        await getUserVotes();
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
        availableVotes: prev.availableVotes + 1,
        isLoading: false,
      }));
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to delete vote";
      setError(msg);
      setVotes((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const getCategoryVotes = useCallback(
    async (categoryId: string): Promise<VoteResponse[]> => {
      try {
        return await voteService.getCategoryVotes(categoryId);
      } catch (err: any) {
        const msg =
          err?.response?.data?.error ?? "Failed to fetch category votes";
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
    getAvailableVotes,
    changeVote,
    deleteVote,
    getCategoryVotes,
    getAllVotes,
    clearError,
    clearVotes,
    error,
  };
};
