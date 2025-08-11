import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useRef,
  type ReactNode,
} from "react";

import type {
  User,
  LoginData,
  RegisterData,
  UpdateProfileData,
  AuthContextType,
  ApiErrorResponse,
  PaginatedResponse,
} from "../types";

import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  checkSession as apiCheckSession,
  updateProfile as apiUpdateProfile,
  uploadAvatar as apiUploadAvatar,
  fetchAllUsers as apiFetchAllUsers,
  updateUserAsAdmin as apiUpdateUserAsAdmin,
} from "../api/modules/auth";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasCheckedSession = useRef(false);

  const [allUsers, setAllUsers] = useState<PaginatedResponse<User> | null>(
    null
  );
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (hasCheckedSession.current) {
      return;
    }
    hasCheckedSession.current = true;

    const checkAuthStatus = async () => {
      try {
        console.log("Checking for active session...");
        const { user } = await apiCheckSession();
        setUser(user);
        console.log("Session found. User is logged in.");
      } catch (error) {
        console.log(
          "No active session found.",
          error instanceof Error ? error.message : String(error)
        );
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = useCallback(async (data: LoginData) => {
    try {
      setIsLoading(true);
      setError(null);
      const { user } = await apiLogin(data);
      setUser(user);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      const errorMessage =
        apiError.message || "Login failed. Please check your credentials.";
      setError(errorMessage);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      setIsLoading(true);
      setError(null);
      const { user } = await apiRegister(data);
      setUser(user);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      const errorMessage =
        apiError.message || "Registration failed. Please try again.";
      setError(errorMessage);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await apiLogout();
      setUser(null);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      const errorMessage = apiError.message || "Logout failed.";
      setError(errorMessage);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData) => {
    try {
      setIsLoading(true);
      setError(null);
      const { user } = await apiUpdateProfile(data);
      setUser(user);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      const errorMessage = apiError.message || "Profile update failed.";
      setError(errorMessage);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);
  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setIsLoading(true);
      setError(null);

      const { user } = await apiUploadAvatar(file);

      setUser(user);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      const errorMessage =
        apiError.message || "Avatar upload failed. Please try again.";
      setError(errorMessage);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchAllUsers = useCallback(async (page?: number, limit?: number) => {
    try {
      setIsFetchingUsers(true);
      setError(null);
      const response = await apiFetchAllUsers(page, limit);
      setAllUsers(response);
    } catch (err) {
      const apiError = err as ApiErrorResponse;
      const errorMessage = apiError.message || "Failed to fetch users.";
      setError(errorMessage);
    } finally {
      setIsFetchingUsers(false);
    }
  }, []);

  const updateUserAsAdmin = useCallback(
    async (userId: string, data: { isActive?: boolean }) => {
      const { user: updatedUser } = await apiUpdateUserAsAdmin(userId, data);
      setAllUsers((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          users: prev.users?.map((u) => (u.id === userId ? updatedUser : u)),
        };
      });
    },
    []
  );

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    allUsers,
    isFetchingUsers,
    login,
    register,
    logout,
    updateProfile,
    uploadAvatar,
    clearError,
    fetchAllUsers,
    updateUserAsAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
