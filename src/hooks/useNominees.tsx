import { useCallback, useState } from "react";
import {
  nomineeService,
  CreateNomineeRequest,
  UpdateNomineeRequest,
  NomineeResponse,
  CategoryBrief,
  NomineeBrief,
  Nominee,
} from "../api/services/nomineeService";

interface NomineesState {
  nominees: Nominee[];
  isLoading: boolean;
}

export interface UseNomineesReturn {
  nominees: NomineesState;
  createNominee: (data: CreateNomineeRequest) => Promise<NomineeResponse>;
  updateNominee: (
    id: string,
    data: UpdateNomineeRequest
  ) => Promise<NomineeResponse>;
  deleteNominee: (id: string) => Promise<void>;
  getNomineeDetails: (id: string) => Promise<NomineeResponse>;
  getAllNominees: () => Promise<void>;
  addCategory: (nomineeId: string, categoryId: string) => Promise<void>;
  removeCategory: (nomineeId: string, categoryId: string) => Promise<void>;
  setCategories: (nomineeId: string, categoryIds: string[]) => Promise<void>;
  getCategories: (nomineeId: string) => Promise<CategoryBrief[]>;
  getNomineesByCategory: (categoryId: string) => Promise<NomineeBrief[]>;
  clearError: () => void;
  clearNominees: () => void;
  error: string | null;
}

export const useNominees = (): UseNomineesReturn => {
  const [nominees, setNominees] = useState<NomineesState>({
    nominees: [],
    isLoading: false,
  });

  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const clearNominees = useCallback(() => {
    setNominees({
      nominees: [],
      isLoading: false,
    });
  }, []);

  const createNominee = useCallback(
    async (data: CreateNomineeRequest): Promise<NomineeResponse> => {
      setNominees((prev) => ({ ...prev, isLoading: true }));
      try {
        const response = await nomineeService.createNominee(data);
        setNominees((prev) => ({
          ...prev,
          nominees: [...prev.nominees, response],
          isLoading: false,
        }));
        return response;
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to create nominee";
        setError(msg);
        setNominees((prev) => ({ ...prev, isLoading: false }));
        throw err;
      }
    },
    []
  );

  const updateNominee = useCallback(
    async (
      id: string,
      data: UpdateNomineeRequest
    ): Promise<NomineeResponse> => {
      setNominees((prev) => ({ ...prev, isLoading: true }));
      try {
        const updated = await nomineeService.updateNominee(id, data);
        setNominees((prev) => ({
          ...prev,
          nominees: prev.nominees.map((n) =>
            n.nominee_id === id ? updated : n
          ),
          isLoading: false,
        }));
        return updated;
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to update nominee";
        setError(msg);
        setNominees((prev) => ({ ...prev, isLoading: false }));
        throw err;
      }
    },
    []
  );

  const deleteNominee = useCallback(async (id: string) => {
    setNominees((prev) => ({ ...prev, isLoading: true }));
    try {
      await nomineeService.deleteNominee(id);
      setNominees((prev) => ({
        ...prev,
        nominees: prev.nominees.filter((n) => n.nominee_id !== id),
        isLoading: false,
      }));
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to delete nominee";
      setError(msg);
      setNominees((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const getNomineeDetails = useCallback(
    async (id: string): Promise<NomineeResponse> => {
      setNominees((prev) => ({ ...prev, isLoading: true }));
      try {
        const nominee = await nomineeService.getNomineeDetails(id);
        setNominees((prev) => ({ ...prev, isLoading: false }));
        return nominee;
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to fetch nominee";
        setError(msg);
        setNominees((prev) => ({ ...prev, isLoading: false }));
        throw err;
      }
    },
    []
  );

  const getAllNominees = useCallback(async () => {
    setNominees((prev) => ({ ...prev, isLoading: true }));
    try {
      const nomineesList = await nomineeService.getAllNominees();
      setNominees({
        nominees: nomineesList,
        isLoading: false,
      });
    } catch (err: any) {
      const msg = err?.response?.data?.error ?? "Failed to fetch nominees";
      setError(msg);
      setNominees((prev) => ({ ...prev, isLoading: false }));
      throw err;
    }
  }, []);

  const addCategory = useCallback(
    async (nomineeId: string, categoryId: string) => {
      try {
        await nomineeService.addCategory(nomineeId, categoryId);
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to add category";
        setError(msg);
        throw err;
      }
    },
    []
  );

  const removeCategory = useCallback(
    async (nomineeId: string, categoryId: string) => {
      try {
        await nomineeService.removeCategory(nomineeId, categoryId);
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to remove category";
        setError(msg);
        throw err;
      }
    },
    []
  );

  const setCategories = useCallback(
    async (nomineeId: string, categoryIds: string[]) => {
      try {
        await nomineeService.setCategories(nomineeId, categoryIds);
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to set categories";
        setError(msg);
        throw err;
      }
    },
    []
  );

  const getCategories = useCallback(
    async (nomineeId: string): Promise<CategoryBrief[]> => {
      try {
        return await nomineeService.getCategories(nomineeId);
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to fetch categories";
        setError(msg);
        throw err;
      }
    },
    []
  );

  const getNomineesByCategory = useCallback(
    async (categoryId: string): Promise<NomineeBrief[]> => {
      try {
        return await nomineeService.getNomineesByCategory(categoryId);
      } catch (err: any) {
        const msg =
          err?.response?.data?.error ?? "Failed to fetch nominees by category";
        setError(msg);
        throw err;
      }
    },
    []
  );

  return {
    nominees,
    createNominee,
    updateNominee,
    deleteNominee,
    getNomineeDetails,
    getAllNominees,
    addCategory,
    removeCategory,
    setCategories,
    getCategories,
    getNomineesByCategory,
    clearError,
    clearNominees,
    error,
  };
};
