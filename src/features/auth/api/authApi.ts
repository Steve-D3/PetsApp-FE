import axios, { type AxiosError } from "axios";
import type { AxiosResponse } from "axios";
import { getCookie } from "../../../utils/cookieUtils";

// Types
interface UserData {
  id: string;
  name: string;
  email: string;
  email_verified_at?: string;
  role: string;
  current_team_id: number | null;
  profile_photo_path: string | null;
  profile_photo_url: string;
}

// Response types are now handled inline with the API methods
// Token is now included in the response directly from the API

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Create axios instance with default config
const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://petdashboard-app-sdkgp.ondigitalocean.app/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true, // Important for CORS with credentials
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

// Import cookie utils
// The getCookie function is already imported at the top of the file

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  async (config) => {
    // Add auth token if it exists
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For non-GET requests, ensure we have a CSRF token
    if (config.method && config.method.toLowerCase() !== "get") {
      // Check if we're in a browser environment
      if (typeof window !== "undefined") {
        let csrfToken = getCookie("XSRF-TOKEN");

        // If we don't have a CSRF token, try to get one
        if (!csrfToken) {
          try {
            // Get the base URL without the /api suffix for CSRF endpoint
            const baseUrl = (
              import.meta.env.VITE_API_URL || "https://test-backend.ddev.site"
            ).replace(/\/api$/, "");
            await axios.get(`${baseUrl}/sanctum/csrf-cookie`, {
              withCredentials: true,
            });
            csrfToken = getCookie("XSRF-TOKEN");
          } catch (error) {
            console.warn(
              "Could not fetch CSRF token, proceeding anyway",
              error
            );
          }
        }

        // Set the CSRF token in the headers if we have one
        if (csrfToken) {
          config.headers = config.headers || {};
          (config.headers as Record<string, string>)["X-XSRF-TOKEN"] =
            csrfToken;
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return the full response so we can access headers, status, etc.
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorMessage = error.response.data?.message || "An error occurred";
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(
        new Error("No response from server. Please check your connection.")
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      return Promise.reject(
        new Error("An error occurred while setting up the request.")
      );
    }
  }
);

export const authApi = {
  /**
   * Logs in a user with the provided credentials
   * @param credentials User login credentials
   * @returns Promise with user data and auth token
   */
  async login(
    credentials: LoginCredentials
  ): Promise<{ user: UserData; token: string }> {
    try {
      type LoginApiResponse = {
        access_token: string;
        token_type: string;
        user: UserData;
      };

      const response = await api.post<LoginApiResponse>("/login", credentials);

      // Log the response for debugging
      console.log("Login response:", response.data);

      // Extract token and user data from the response
      const { access_token: token, user } = response.data;

      if (!token || !user) {
        throw new Error("No token or user data received from server");
      }

      // Store the token in localStorage
      localStorage.setItem("token", token);

      // Set the default Authorization header
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      return {
        user,
        token,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiError>;
        if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(axiosError.response.data?.message || "Login failed");
        } else if (axiosError.request) {
          // The request was made but no response was received
          throw new Error("No response received from server");
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new Error(axiosError.message);
        }
      }
      throw new Error("An unexpected error occurred");
    }
  },

  /**
   * Registers a new user
   * @param userData User registration data
   * @returns Promise with the created user data
   */
  async register(
    userData: RegisterData
  ): Promise<{ success: boolean; message: string }> {
    try {
      type RegisterApiResponse = {
        message: string;
        user: UserData;
      };

      const response = await api.post<RegisterApiResponse>(
        "/register",
        userData
      );

      if (!response.data.user) {
        console.error("User data not found in response:", response.data);
        throw new Error(
          "Registration successful, but there was an issue with the response."
        );
      }

      return {
        success: true,
        message:
          response.data.message ||
          "Registration successful! Please log in with your credentials.",
      };
    } catch (error) {
      console.error("Registration API error:", error);

      if (axios.isAxiosError(error)) {
        // Handle validation errors (422)
        if (error.response?.status === 422 && error.response.data) {
          const errorData = error.response.data as {
            errors?: Record<string, string[]>;
          };
          const errorMessages = Object.entries(errorData.errors || {})
            .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
            .join("\n");
          throw new Error(`Validation failed: ${errorMessages}`);
        }

        // Handle other API errors
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Registration failed";
        throw new Error(errorMessage);
      }

      throw new Error("An unknown error occurred during registration");
    }
  },

  /**
   * Resets a user's password
   * @param data Reset password data
   * @returns Promise with the reset password response
   */
  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) {
    try {
      const response = await api.post("/reset-password", data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Password reset failed";
        throw new Error(errorMessage);
      }
      throw new Error("An unknown error occurred during password reset");
    }
  },

  /**
   * Gets the currently authenticated user's data
   * @returns Promise with the current user's data
   */
  async getCurrentUser(): Promise<UserData> {
    // First try to get user data from localStorage
    const userDataStr = localStorage.getItem("user");
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData && userData.id) {
          return userData;
        }
      } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
      }
    }

    // If no user data in localStorage, try to fetch it from the API
    try {
      const response = await api.get<{ data: UserData }>("/me");
      if (response.data && response.data.data) {
        // Cache the user data in localStorage
        localStorage.setItem("user", JSON.stringify(response.data.data));
        return response.data.data;
      }
      throw new Error("No user data in response");
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw new Error("Failed to fetch current user. Please log in again.");
    }
  },

  /**
   * Logs out the current user
   */
  async logout(): Promise<void> {
    try {
      await api.post("/logout");
    } catch (error) {
      // Even if logout fails on the server, we still want to clear the token
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
    }
  },

  /**
   * Checks if the current auth token is valid
   * @returns boolean indicating if the token is valid
   */
  async validateToken(): Promise<boolean> {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      // Clear invalid token if request fails with 401
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("token");
      }
      return false;
    }
  },

  /**
   * Sends a password reset link to the provided email
   * @param data Object containing the user's email
   * @returns Promise that resolves when the request is complete
   */
  async forgotPassword(data: { email: string }): Promise<void> {
    try {
      // This endpoint should be implemented in your backend
      await api.post("/forgot-password", data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to send password reset email";
        throw new Error(errorMessage);
      }
      throw new Error("An unexpected error occurred");
    }
  },
};

export default authApi;
