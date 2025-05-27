import axios from "axios";
import { authApi } from "../../../features/auth/api/authApi";

// Types
export interface MedicalRecord {
  id: number;
  record_date: string;
  chief_complaint: string;
  history: string;
  physical_examination: string;
  diagnosis: string;
  treatment_plan: string;
  medications: string | null;
  notes: string | null;
  weight: string;
  temperature: string;
  heart_rate: number;
  respiratory_rate: number;
  follow_up_required: boolean;
  follow_up_date: string | null;
}

export interface Clinic {
  id: number;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  website: string;
}

export interface Veterinarian {
  id: number;
  user_id: number;
  license_number: string;
  specialty: string;
  biography: string;
  phone_number: string;
  off_days: string[];
  clinic: Clinic;
}

export interface PetWithRecords extends Omit<Pet, "owner"> {
  medical_records: MedicalRecord[];
}

export interface Appointment {
  id: number;
  pet_id: number;
  veterinarian_id: number;
  start_time: string;
  end_time: string;
  status: string;
  notes: string;
  pet: PetWithRecords;
  veterinarian: Veterinarian;
}

export interface PetOwner {
  id: number;
  name: string;
  email: string;
  role: string;
  current_team_id: number | null;
  profile_photo_path: string | null;
  profile_photo_url: string;
}

export interface Pet {
  id: number;
  name: string;
  photo: string;
  microchip_number: string;
  sterilized: number; // 0 or 1
  species: string;
  breed: string;
  gender: string;
  weight: number;
  birth_date: string;
  allergies: string;
  food_preferences: string;
  owner: PetOwner;
}

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://petdashboard-app-sdkgp.ondigitalocean.app/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token"); // Changed from 'auth_token' to 'token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("No token found in localStorage");
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

const petsApi = {
  /**
   * Fetches all pets for the current user
   * @returns Promise with array of pets
   */
  async getUserPets(): Promise<Pet[]> {
    try {
      // Get the current user to ensure we're authenticated and get the correct user ID
      const user = await authApi.getCurrentUser();
      if (!user) {
        throw new Error("No authenticated user found. Please log in.");
      }

      // Get the user ID - check both user.data.id and user.id
      const userId = user.data?.id || user.id;

      if (!userId) {
        console.error("User object structure:", JSON.stringify(user, null, 2));
        throw new Error("No user ID found in the user object");
      }

      console.log("Using user ID:", userId);
      console.log("Making API request to fetch pets...");

      // Make the API request with the user ID from the authenticated user
      const response = await api.get<Pet[]>(`/pets?user_id=${userId}`);
      console.log("Pets API response:", response);
      return response.data;
    } catch (error) {
      console.error("Error in getUserPets:", error);
      // If the error is about token parsing, clear the invalid token
      if (error instanceof Error && error.message.includes("token")) {
        localStorage.removeItem("token");
      }
      throw error;
    }
  },

  /**
   * Fetches a single pet by ID
   * @param petId The ID of the pet to fetch
   * @returns Promise with the pet data
   */
  async getPetById(petId: number): Promise<Pet> {
    try {
      const response = await api.get<Pet>(`/pets/${petId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching pet with ID ${petId}:`, error);
      throw error;
    }
  },

  getPetAppointments: async (petId: number): Promise<Appointment[]> => {
    const response = await api.get(`/appointments?pet_id=${petId}`);
    return response.data.data || [];
  },

  getAllAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments');
    return response.data.data || [];
  },
  createAppointment: async (appointmentData: Omit<Appointment, 'id' | 'pet' | 'veterinarian'>): Promise<Appointment> => {
    try {
      const response = await api.post<{ data: Appointment }>('/appointments', appointmentData);
      return response.data.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
};

export default petsApi;
