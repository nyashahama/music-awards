import React, {
  useState,
  useCallback,
  useContext,
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
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
  lastFetched: number | null; // Add timestamp
}

const PROFILE_CACHE_DURATION = 5 * 60 * 1000;

interface UsersState {
  users: User[];
  isLoading: boolean;
}

// Extended LoginRequest to include rememberMe
export interface LoginRequestWithRemember extends LoginRequest {
  rememberMe?: boolean;
}

export interface UseUsersReturn {
  // Auth state
  auth: AuthState;
  users: UsersState;
  // Auth actions
  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequestWithRemember) => Promise<void>;
  logout: () => void;
  forgotPassword: (data: ForgotPasswordRequest) => Promise<void>;
  resetPassword: (data: ResetPasswordRequest) => Promise<void>;
  validateResetToken: (token: string) => Promise<ValidateResetTokenResponse>;
  // User management actions
  getAllUsers: () => Promise<void>;
  getProfile: (id: string, forceRefresh?: boolean) => Promise<User>;
  updateProfile: (id: string, data: UpdateProfileRequest) => Promise<void>;
  deleteAccount: (id: string) => Promise<void>;
  promoteUser: (id: string) => Promise<void>;
  // Utility
  clearError: () => void;
  clearUsers: () => void;
}

export interface UseUsersOptions {
  onLogin?: (user: User | null) => void;
  onLogout?: () => void;
  onError?: (error: string) => void;
}

/* ---------- Context ---------- */
type AuthContextType = UseUsersReturn;
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ---------- Helpers ---------- */
// Helper to get token from either storage
function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

// Helper to store token based on rememberMe preference
function storeToken(token: string, rememberMe: boolean) {
  if (typeof window === "undefined") return;

  if (rememberMe) {
    localStorage.setItem("token", token);
    sessionStorage.removeItem("token"); // Clear from session if it exists
  } else {
    sessionStorage.setItem("token", token);
    localStorage.removeItem("token"); // Clear from local if it exists
  }
}

// Helper to remove token from both storages
function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
}

// Small JWT payload parser
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
    lastFetched: null, // Fixed: should be null initially
  });

  const [users, setUsers] = useState<UsersState>({
    users: [],
    isLoading: false,
  });

  const [error, setError] = useState<string | null>(null);

  // Add request deduplication
  const pendingProfileRequests = useRef<Map<string, Promise<User>>>(new Map());

  const clearError = useCallback(() => setError(null), []);
  const clearUsers = useCallback(
    () => setUsers({ users: [], isLoading: false }),
    []
  );

  // Initialize token from storage and try to fetch current user
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getStoredToken();
      if (!token) return;

      setAuth((prev) => ({
        ...prev,
        token,
        isAuthenticated: true,
        isLoading: true,
      }));

      const payload = parseJwtPayload(token);
      const userId = payload?.user_id ?? payload?.sub ?? payload?.id ?? null;

      if (userId) {
        try {
          // Use getProfile instead of direct service call to benefit from caching
          const userData = await getProfile(userId);
          setAuth((prev) => ({ ...prev, user: userData, isLoading: false }));
          options?.onLogin?.(userData);
        } catch (error) {
          // If we get here, it failed
          removeToken();
          setAuth({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            lastFetched: null,
          });
          options?.onError?.("Failed to fetch profile for saved token");
        }
      } else {
        setAuth((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, []);

  /* ---------- Auth actions ---------- */
  const register = useCallback(
    async (data: RegisterRequest) => {
      setAuth((p) => ({ ...p, isLoading: true }));
      try {
        const resp = await userService.register(data);
        const token = resp.token;

        // Default to rememberMe=true for registration
        storeToken(token, true);

        setAuth((prev) => ({
          ...prev,
          user: resp.user,
          token,
          isAuthenticated: true,
          isLoading: false,
          lastFetched: Date.now(),
        }));

        // Call onLogin callback after successful registration
        options?.onLogin?.(resp.user);
      } catch (err: any) {
        setAuth((p) => ({ ...p, isLoading: false }));
        const msg = err?.response?.data?.error ?? "Registration failed";
        setError(msg);
        options?.onError?.(msg);
        throw err;
      }
    },
    [options]
  );

  const login = useCallback(
    async (data: LoginRequestWithRemember) => {
      setAuth((p) => ({ ...p, isLoading: true }));
      try {
        // Extract rememberMe, default to false
        const { rememberMe = false, ...loginData } = data;

        const resp = await userService.login(loginData);
        const token = resp.token;

        // Store token based on rememberMe preference
        storeToken(token, rememberMe);

        setAuth((prev) => ({ ...prev, token, isAuthenticated: true }));

        // Try to fetch user
        const payload = parseJwtPayload(token);
        const userId = payload?.user_id ?? payload?.sub ?? payload?.id ?? null;

        if (userId) {
          try {
            const u = await getProfile(userId);
            setAuth((prev) => ({ ...prev, user: u, isLoading: false }));
            options?.onLogin?.(u);
            return;
          } catch (err) {
            console.warn("Failed to fetch profile after login:", err);
          }
        }

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
    removeToken();
    setAuth({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      lastFetched: null,
    });
    clearUsers();
    options?.onLogout?.();
  }, [options, clearUsers]);

  const forgotPassword = useCallback(
    async (data: ForgotPasswordRequest) => {
      try {
        await userService.forgotPassword(data);
      } catch (err: any) {
        const msg =
          err?.response?.data?.error ?? "Password reset request failed";
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

  // FIXED: getProfile with proper caching and deduplication
  const getProfile = useCallback(
    async (id: string, forceRefresh = false) => {
      // If there's already a pending request for this user, return it
      if (pendingProfileRequests.current.has(id)) {
        return pendingProfileRequests.current.get(id)!;
      }

      // Check cache if not forcing refresh
      if (
        !forceRefresh &&
        auth.user?.user_id === id &&
        auth.lastFetched &&
        Date.now() - auth.lastFetched < PROFILE_CACHE_DURATION
      ) {
        return auth.user;
      }

      try {
        const request = userService.getProfile(id);
        pendingProfileRequests.current.set(id, request);

        const u = await request;
        setAuth((prev) => {
          if (prev.user?.user_id === id || prev.user === null) {
            return { ...prev, user: u, lastFetched: Date.now() };
          }
          return prev;
        });
        return u;
      } catch (err: any) {
        const msg = err?.response?.data?.error ?? "Failed to fetch profile";
        setError(msg);
        options?.onError?.(msg);
        throw err;
      } finally {
        // Clean up the pending request
        pendingProfileRequests.current.delete(id);
      }
    },
    [auth.user, auth.lastFetched, options]
  );

  const updateProfile = useCallback(
    async (id: string, data: UpdateProfileRequest) => {
      try {
        const updated = await userService.updateProfile(id, data);
        setUsers((prev) => ({
          ...prev,
          users: prev.users.map((x) => (x.user_id === id ? updated : x)),
        }));
        setAuth((prev) =>
          prev.user?.user_id === id
            ? { ...prev, user: updated, lastFetched: Date.now() }
            : prev
        );
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
        setUsers((prev) => ({
          ...prev,
          users: prev.users.filter((u) => u.user_id !== id),
        }));
        setAuth((prev) => {
          if (prev.user?.user_id === id) {
            removeToken();
            return {
              user: null,
              token: null,
              isAuthenticated: false,
              isLoading: false,
              lastFetched: null,
            };
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

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  options,
}) => {
  const auth = useUsers(options);
  const value = useMemo(() => auth, [auth]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): UseUsersReturn => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};
