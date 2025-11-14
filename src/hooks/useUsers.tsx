import React, {
  useState,
  useCallback,
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useMemo,
} from "react";
import {
  userService,
  User,
  RegisterRequest,
  LoginRequest,
  UpdateProfileRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ValidateResetTokenResponse,
} from "../api/services/userService";
/* ---------- Interfaces ---------- */
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
interface UsersState {
  users: User[];
  isLoading: boolean;
}
export interface UseUsersReturn {
  // Auth state
  auth: AuthState;
  users: UsersState;
  // Auth actions
  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  validateResetToken: (token: string) => Promise<ValidateResetTokenResponse>;
  // User management actions
  getAllUsers: () => Promise<void>;
  getProfile: (id: string) => Promise<User>;
  updateProfile: (id: string, data: UpdateProfileRequest) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  promoteUser: (id: string) => Promise<void>;
  // Utility
  clearError: () => void;
  clearUsers: () => void;
}
export interface UseUsersOptions {
  // onLogin may get a user (or null if user fetch failed)
  onLogin?: (user: User | null) => void;
  onLogout?: () => void;
  onError?: (error: string) => void;
}
/* ---------- Context ---------- */
type AuthContextType = UseUsersReturn;
const AuthContext = createContext<AuthContextType | undefined>(undefined);
/* ---------- Helpers ---------- */
// Small JWT payload parser to try to extract user id (if your token has it).
// Not cryptographically validated—only used to extract a claim client-side.
function parseJwtPayload(token: string | null) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}
/* ---------- Hook Implementation ---------- */
export const useUsers = (options?: UseUsersOptions): UseUsersReturn => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  });
  const [users, setUsers] = useState<UsersState>({ users: [], isLoading: false });
  const [error, setError] = useState<string | null>(null);
  const clearError = useCallback(() => setError(null), []);
  const clearUsers = useCallback(() => setUsers({ users: [], isLoading: false }), []);
  // Initialize token from localStorage and try to fetch current user
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return;
    setAuth((prev) => ({ ...prev, token, isAuthenticated: true, isLoading: true }));
    // Option A: If your backend has a /me endpoint, use that instead of parsing token
    const payload = parseJwtPayload(token);
    const userId =
      payload?.user_id ?? payload?.sub ?? payload?.id ?? null;
    if (userId) {
      userService
        .getProfile(userId)
        .then((u) => {
          setAuth((prev) => ({ ...prev, user: u, isLoading: false }));
          options?.onLogin?.(u);
        })
        .catch(() => {
          // couldn't fetch user for token - clear token
          localStorage.removeItem("token");
          setAuth({ user: null, token: null, isAuthenticated: false, isLoading: false });
          options?.onError?.("Failed to fetch profile for saved token");
        });
    } else {
      // If we cannot find a user id in token, just stop loading and allow explicit fetch later
      setAuth((prev) => ({ ...prev, isLoading: false }));
    }
    // only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  /* ---------- Auth actions ---------- */
  const register = useCallback(
    async (data: RegisterRequest) => {
      setAuth((p) => ({ ...p, isLoading: true }));
      try {
        const user = await userService.register(data);
        setAuth((prev) => ({ ...prev, user, isAuthenticated: true, isLoading: false }));
      } catch (err: any) {
        setAuth((p) => ({ ...p, isLoading: false }));
        const msg = err?.response?.data?.error ?? "Registration failed";
        setError(msg);
        console.log(msg); // Fixed from console.log(error)
        options?.onError?.(msg);
        throw err;
      }
    },
    [options]
  );
  const login = useCallback(
    async (data: LoginRequest) => {
      setAuth((p) => ({ ...p, isLoading: true }));
      try {
        const resp = await userService.login(data);
        const token = resp.token;
        localStorage.setItem("token", token);
        setAuth((prev) => ({ ...prev, token, isAuthenticated: true }));
        // Try to fetch user (via token payload or "me" endpoint)
        const payload = parseJwtPayload(token);
        const userId = payload?.user_id ?? payload?.sub ?? payload?.id ?? null;
        if (userId) {
          try {
            const u = await userService.getProfile(userId);
            setAuth((prev) => ({ ...prev, user: u, isLoading: false }));
            options?.onLogin?.(u);
            return;
          } catch (err) {
            // swallow and continue to notify onLogin with null
            console.warn("Failed to fetch profile after login:", err);
          }
        }
        // If we couldn't fetch the user, finish login but notify without user
        setAuth((prev) => ({ ...prev, isLoading: false }));
        options?.onLogin?.(null);
      } catch (err: any) {
        setAuth((p) => ({ ...p, isLoading: false }));
        const msg = err?.response?.data?.error ?? "Login failed";
        setError(msg);
        options?.onError?.(msg);
        throw err;
      }
    },
    [options]
  );
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setAuth({ user: null, token: null, isAuthenticated: false, isLoading: false });
    clearUsers();
    options?.onLogout?.();
  }, [options, clearUsers]);
  const forgotPassword = useCallback(
    async (data: ForgotPasswordRequest) => {
      try {
        await userService.forgotPassword(data);
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Password reset request failed";
        setError(msg);
        options?.onError?.(msg);
        throw err;
      }
    },
    [options]
  );
  const resetPassword = useCallback(
    async (data: ResetPasswordRequest) => {
      try {
        await userService.resetPassword(data);
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Password reset failed";
        setError(msg);
        options?.onError?.(msg);
        throw err;
      }
    },
    [options]
  );
  const validateResetToken = useCallback(
    async (token: string) => {
      try {
        return await userService.validateResetToken(token);
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Token validation failed";
        setError(msg);
        options?.onError?.(msg);
        throw err;
      }
    },
    [options]
  );
  /* ---------- User management ---------- */
  const getAllUsers = useCallback(async () => {
    setUsers((p) => ({ ...p, isLoading: true }));
    try {
      const list = await userService.getAllUsers();
      setUsers({ users: list, isLoading: false });
    } catch (err: any) {
      setUsers((p) => ({ ...p, isLoading: false }));
      const msg = err?.response?.data?.error ?? "Failed to fetch users";
      setError(msg);
      options?.onError?.(msg);
      throw err;
    }
  }, [options]);
  const getProfile = useCallback(
    async (id: string) => {
      try {
        const u = await userService.getProfile(id);
        // update auth if same user
        setAuth((prev) => {
          if (prev.user?.user_id === id || prev.user === null) {
            return { ...prev, user: u };
          }
          return prev;
        });
        return u;
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to fetch profile";
        setError(msg);
        options?.onError?.(msg);
        throw err;
      }
    },
    [options]
  );
  const updateProfile = useCallback(
    async (id: string, data: UpdateProfileRequest) => {
      try {
        const updated = await userService.updateProfile(id, data);
        setUsers((prev) => ({
          ...prev,
          users: prev.users.map((x) => (x.user_id === id ? updated : x)),
        }));
        setAuth((prev) => (prev.user?.user_id === id ? { ...prev, user: updated } : prev));
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to update profile";
        setError(msg);
        options?.onError?.(msg);
        throw err;
      }
    },
    [options]
  );
  const deleteAccount = useCallback(
    async (id: string) => {
      try {
        await userService.deleteAccount(id);
        setUsers((prev) => ({ ...prev, users: prev.users.filter((u) => u.user_id !== id) }));
        setAuth((prev) => {
          if (prev.user?.user_id === id) {
            // If current user deleted their account -> log out
            localStorage.removeItem("token");
            return { user: null, token: null, isAuthenticated: false, isLoading: false };
          }
          return prev;
        });
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to delete account";
        setError(msg);
        options?.onError?.(msg);
        throw err;
      }
    },
    [options]
  );
  const promoteUser = useCallback(
    async (id: string) => {
      try {
        await userService.promoteUser(id);
        // simple approach: re-fetch users
        await getAllUsers();
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to promote user";
        setError(msg);
        options?.onError?.(msg);
        throw err;
      }
    },
    [getAllUsers, options]
  );
  /* ---------- Return ---------- */
  return {
    auth,
    users,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    validateResetToken,
    getAllUsers,
    getProfile,
    updateProfile,
    deleteAccount,
    promoteUser,
    clearError,
    clearUsers,
  };
};
/* ---------- Provider & useAuth ---------- */
export interface AuthProviderProps {
  children: ReactNode;
  options?: UseUsersOptions;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children, options }) => {
  const auth = useUsers(options);
  // memoize to avoid re-render storms
  const value = useMemo(() => auth, [auth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = (): UseUsersReturn => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
