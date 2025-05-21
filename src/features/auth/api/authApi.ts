import axios, { type AxiosError } from "axios";
import type { AxiosResponse } from "axios";

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  current_team_id?: number | null;
  profile_photo_path?: string | null;
  profile_photo_url?: string;
}

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterResponse {
  user: User;
}

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
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('Sending login request to /login with:', credentials);
      const response = await api.post<{
        access_token: string;
        token_type: string;
        user: {
          id: number;
          name: string;
          email: string;
          role: string;
          current_team_id: number | null;
          profile_photo_path: string | null;
          profile_photo_url: string;
        };
      }>("/login", credentials);
      
      console.log('API response:', response.data);
      
      const { access_token: token, user } = response.data;
      
      if (!token) {
        console.error('No access_token in response:', response.data);
        throw new Error('Authentication failed: No access token received');
      }
      
      if (!user) {
        console.error('No user data in response:', response.data);
        throw new Error('Authentication failed: No user data received');
      }
      
      // Store the token
      localStorage.setItem("token", token);
      
      // Map the API user to our User type
      const mappedUser: User = {
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
        current_team_id: user.current_team_id,
        profile_photo_path: user.profile_photo_path,
        profile_photo_url: user.profile_photo_url
      };
      
      return {
        user: mappedUser,
        token
      };
    } catch (error: unknown) {
      console.error('Login API error:', error);
      
      // Handle Axios error response
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const errorData = error.response.data || {};
          const errorMessage = errorData.message || errorData.error || 'Login failed';
          console.error('Server responded with error:', error.response.status, errorMessage);
          throw new Error(`Login failed: ${errorMessage} (${error.response.status})`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          throw new Error('No response from server. Please check your connection.');
        }
      }
      
      // Handle other types of errors
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      throw new Error(`Login failed: ${errorMessage}`);
    }
  },

  /**
   * Registers a new user
   * @param userData User registration data
   * @returns Promise with the created user data
   */
  async register(userData: RegisterData): Promise<RegisterResponse> {
    try {
      console.log('Sending registration request with:', userData);
      const response = await api.post("/register", userData);
      
      // The API returns the user data directly
      const user = response.data as User;
      
      // If the response includes a token, store it
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return { user };
    } catch (error) {
      console.error('Registration API error:', error);
      
      if (axios.isAxiosError(error)) {
        // Handle validation errors (422)
        if (error.response?.status === 422 && error.response.data) {
          const errorData = error.response.data as { errors?: Record<string, string[]> };
          const errorMessages = Object.entries(errorData.errors || {})
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('\n');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        
        // Handle other API errors
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
        throw new Error(errorMessage);
      }
      
      throw new Error('An unknown error occurred during registration');
    }
  },

  /**
   * Fetches the currently authenticated user's data
   * @returns Promise with the current user's data
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>("/me");
    // The interceptor already returns the data part, so we can cast it directly
    return response as unknown as User;
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
};

export default authApi;
