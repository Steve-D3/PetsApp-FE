import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  current_team_id?: number | null;
  profile_photo_path?: string | null;
  profile_photo_url?: string;
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

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const checkAuth = useCallback(async () => {
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
  }, []);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [checkAuth]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting login with credentials:", credentials);
      const response = await authApi.login(credentials);
      console.log("Login response:", response);

      if (!response || !response.token) {
        throw new Error("Invalid response from server");
      }

      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem("token", response.token);
      navigate("/dashboard", { replace: true });
      return response.user;
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
  }, []);

  const register = useCallback(async (userData: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authApi.register(userData);
      return response.user;
    } catch (err) {
      const errorMessage = (err as Error).message || "Registration failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    }
  }, [navigate]);

  return {
    user,
    isLoading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth,
  };
};

export default useAuth;
