import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

// Define the shape of the auth context
export interface AuthContextType {
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (
    credentials: LoginCredentials
  ) => Promise<{ data: UserData; token: string }>;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<UserData | null>;
  setToken: (token: string) => void;
  updateUser: (userData: Partial<UserData>) => void;
}

export interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  current_team_id?: number | null;
  profile_photo_path?: string | null;
  profile_photo_url?: string;
  photoURL?: string;
}

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

// ApiResponse interface has been removed as it's no longer needed

// Token is now included in the response directly from authApi.register

export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [, setTokenState] = useState<string | null>(
    localStorage.getItem("token")
  );
  const navigate = useNavigate();

  // Set token in state and local storage
  const setToken = useCallback((newToken: string) => {
    setTokenState(newToken);
    localStorage.setItem("token", newToken);
  }, []);

  // Clear token from state and local storage
  const clearToken = useCallback(() => {
    setTokenState(null);
    localStorage.removeItem("token");
  }, []);

  const checkAuth = useCallback(async (): Promise<UserData | null> => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }

    try {
      setIsLoading(true);
      const userData = await authApi.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (err) {
      console.error("Authentication check failed:", err);
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setUser, setIsAuthenticated]);

  // Set up effect to check auth status on mount
  useEffect(() => {
    let isMounted = true;

    const verifyAuth = async () => {
      const token = localStorage.getItem("token");
      if (!isMounted) return;

      if (token) {
        try {
          await checkAuth();
        } catch (error) {
          console.error("Auth verification failed:", error);
        }
      }
      if (isMounted) {
        setIsLoading(false);
      }
    };

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [checkAuth, setIsLoading]);

  const login = useCallback(
    async (
      credentials: LoginCredentials
    ): Promise<{ data: UserData; token: string }> => {
      setIsLoading(true);
      setError(null);

      try {
        const { user: userData, token } = await authApi.login(credentials);

        if (!userData || !token) {
          throw new Error(
            "Invalid response from server: missing user data or token"
          );
        }

        setToken(token);
        setUser(userData);
        setIsAuthenticated(true);

        localStorage.setItem("user", JSON.stringify(userData));

        navigate("/dashboard");

        return { data: userData, token };
      } catch (err) {
        console.error("Login error:", err);
        const errorMessage = (err as Error).message || "Login failed";
        setError(errorMessage);
        // Clear any invalid token
        localStorage.removeItem("token");
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, setToken, setUser, setIsAuthenticated, setError]
  );

  const register = useCallback(
    async (
      registrationData: RegisterData
    ): Promise<{ success: boolean; message: string }> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await authApi.register(registrationData);

        // Show success message
        setError(null);

        // Show success message and wait before redirecting
        const redirectAfterMs = 5000; // Match the toast duration

        // Use a promise to wait before redirecting
        await new Promise((resolve) => setTimeout(resolve, redirectAfterMs));

        // Redirect to login page after the delay
        navigate("/login", {
          state: {
            registrationSuccess: true,
            message: result.message,
          },
          replace: true,
        });

        return result;
      } catch (err) {
        const errorMessage = (err as Error).message || "Registration failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, setError, setIsLoading]
  );

  const updateUser = useCallback((userData: Partial<UserData>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...userData } : null));
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      clearToken();
      navigate("/login", { replace: true });
    }
  }, [navigate, clearToken, setUser, setIsAuthenticated]);

  // Memoize the auth context value to prevent unnecessary re-renders
  const authContextValue: AuthContextType = {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
    setToken,
    updateUser,
  };

  return authContextValue;
};

export default useAuth;
