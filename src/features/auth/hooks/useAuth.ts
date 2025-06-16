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
  ) => Promise<{ data: UserData; token: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<UserData | null>;
  setToken: (token: string) => void;
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

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: {
    headers: {
      [key: string]: string;
    };
    [key: string]: unknown;
  };
  request: object;
}

interface AuthResponse extends ApiResponse<UserData> {
  token: string;
}

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
    async (credentials: LoginCredentials): Promise<{ data: UserData; token: string }> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Attempting to login with credentials:', credentials);
        const response = await authApi.login(credentials);
        console.log('Login response in useAuth:', response);
        
        // The response should have both user data and token
        const userData = response.data || response;
        const token = response.token;

        if (!userData || !token) {
          throw new Error('Invalid response from server: missing user data or token');
        }

        console.log('Setting user data:', userData);
        console.log('Setting token:', token);
        
        // Ensure the token is set in the auth state and localStorage
        setToken(token);
        
        // Set the user data in the auth state
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store user data in localStorage (as a fallback)
        localStorage.setItem('user', JSON.stringify(userData));

        // Redirect to dashboard after successful login
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
    async (registrationData: RegisterData): Promise<{ data: UserData; token: string }> => {
      setIsLoading(true);
      setError(null);

      try {
        const response: AuthResponse = await authApi.register(registrationData);
        const userData = response.data;
        const { token } = response;

        setUser(userData);
        setToken(token);
        setIsAuthenticated(true);

        // Redirect to dashboard after successful registration
        navigate("/dashboard");

        return { data: userData, token };
      } catch (err) {
        const errorMessage = (err as Error).message || "Registration failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, setToken, setUser, setIsAuthenticated, setError, setIsLoading]
  );

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
  };

  return authContextValue;
};

export default useAuth;
