import axios from "axios";
import { authApi } from "../../../features/auth/api/authApi";
import type { PetFormData } from "../types";

// Types
export interface MedicalRecord {
  id: number;
  record_date: string;
  chief_complaint: string;
  history: string;
  physical_examination: string;
  diagnosis: string;
  treatment_plan: string;
  medications: string;
  notes: string;
  weight: string;
  temperature: string;
  heart_rate: number;
  respiratory_rate: number;
  follow_up_required: boolean;
  follow_up_date: string;
  pet: Pet;
  vet: {
    id: number;
    user_id: number;
    license_number: string;
    specialty: string;
    biography: string;
    phone_number: string;
    off_days: string[];
  };
  appointment: {
    id: number;
    pet_id: number;
    veterinarian_id: number;
    start_time: string;
    end_time: string;
    status: string;
    notes: string;
  };
  treatments: [
    {
      id: number;
      medical_record_id: number;
      name: string;
      category: string;
      description: string;
      cost: string;
      quantity: string;
      unit: string;
      completed: boolean;
      administered_at: string;
      administered_by: number;
      treatment_type_id: number;
    }
  ];
  vaccinations: [
    {
      id: number;
      pet_id: number;
      medical_record_id: number;
      vaccine_type_id: number;
      manufacturer: string;
      batch_number: string;
      serial_number: string;
      expiration_date: string;
      administration_date: string;
      next_due_date: string;
      administered_by?: number;
      administration_site: string;
      administration_route: string;
      dose: number;
      dose_unit: string;
      is_booster: boolean;
      certification_number?: string;
      reaction_observed: boolean;
      reaction_details: string;
      notes?: string;
      cost: number;
      reminder_sent: boolean;
      created_at: string;
      updated_at: string;
      vaccination_type: {
        id: number;
        name: string;
        category: string;
        for_species: string;
        description: string;
        default_validity_period: number;
        is_required_by_law: boolean;
        minimum_age_days: number;
        administration_protocol: string;
        common_manufacturers: string;
        requires_booster: boolean;
        booster_waiting_period?: number;
        default_administration_route: string;
        default_cost: number;
        created_at: string;
        updated_at: string;
      };
    }
  ];
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
  veterinarians: Veterinarian[];
}

export interface Veterinarian {
  id: number;
  user_id: number;
  license_number: string;
  specialty: string;
  biography: string;
  phone_number: string;
  off_days: string[];
  user: PetOwner;
  clinic: Clinic;
}

export interface Appointment {
  id: number;
  pet_id: number;
  veterinarian_id: number;
  location_id: number;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "cancelled";
  notes?: string;
  created_at?: string;
  updated_at?: string;
  pet: Pet;
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
  weight: string | number;
  birth_date: string;
  allergies: string;
  food_preferences: string;
  owner: PetOwner;
  created_at?: string;
  updated_at?: string;
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
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      // Set the authorization header
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Get the current user to ensure we're authenticated and get the correct user ID
      const user = await authApi.getCurrentUser();
      if (!user) {
        throw new Error("No authenticated user found. Please log in.");
      }

      // Get the user ID
      const userId = user.id;

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

  createPet: async (data: PetFormData): Promise<Pet> => {
    const response = await api.post("/pets", data);
    return response.data;
  },

  getPetAppointments: async (petId: number): Promise<Appointment[]> => {
    const response = await api.get(`/appointments?pet_id=${petId}`);
    return response.data.data || [];
  },

  getAllAppointments: async (): Promise<Appointment[]> => {
    const response = await api.get("/appointments");
    return response.data.data || [];
  },
  createAppointment: async (
    appointmentData: Omit<Appointment, "id" | "pet" | "veterinarian">
  ): Promise<Appointment> => {
    try {
      const response = await api.post<Appointment>(
        "/appointments",
        appointmentData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating appointment:", error);
      throw error;
    }
  },

  /**
   * Fetches all available veterinarians
   * @returns Promise with array of veterinarians
   */
  getVets: async (): Promise<Veterinarian[]> => {
    const response = await api.get("/vets");
    return response.data;
  },

  getClinics: async (): Promise<Clinic[]> => {
    const response = await api.get("/clinics");
    return response.data;
  },

  /**
   * Fetches available time slots for a vet on a specific date
   * @param vetId The ID of the veterinarian
   * @param date The date in YYYY-MM-DD format
   * @returns Promise with array of available time slots
   */
  getAvailableSlots: async (vetId: number, date: string): Promise<string[]> => {
    // Since the baseURL already includes /api, we don't include it in our paths
    const endpoints = [
      // Most common endpoint patterns
      `vets/${vetId}/available-slots`,
      `appointments/available-slots/${vetId}`,
      // Try with query parameter for vetId
      `appointments/available-slots?vet_id=${vetId}`,
      // Try with different path structure
      `v1/vets/${vetId}/slots`,
      // Try with different casing
      `Vets/${vetId}/available-slots`,
    ];

    // Try each endpoint in sequence until one works
    for (const endpoint of endpoints) {
      try {
        console.log(`Trying endpoint: ${endpoint} for vet ${vetId} on ${date}`);
        const response = await api.get(endpoint, {
          params: { date },
          validateStatus: (status) => status < 500, // Don't throw for 4xx errors
        });

        // If we got a successful response but no data, try next endpoint
        if (!response.data) {
          console.warn(`No data in response from ${endpoint}`);
          continue;
        }

        // Handle different response formats
        let slots: string[] = [];
        if (Array.isArray(response.data)) {
          slots = response.data;
        } else if (response.data && Array.isArray(response.data.slots)) {
          slots = response.data.slots;
        } else if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data)
        ) {
          slots = response.data.data;
        } else {
          console.warn(
            `Unexpected response format from ${endpoint}:`,
            response.data
          );
          continue;
        }

        console.log(
          `Successfully fetched ${slots.length} slots from ${endpoint}`
        );
        return slots;
      } catch (error) {
        console.warn(`Error with endpoint ${endpoint}:`, error);
        // Continue to next endpoint
      }
    }

    // If we get here, all endpoints failed
    console.error(`All endpoints failed for vet ${vetId} on ${date}`);

    // Return mock data for development purposes
    if (import.meta.env.DEV) {
      console.warn("Using mock time slots for development");
      return [
        "09:00",
        "09:30",
        "10:00",
        "10:30",
        "11:00",
        "11:30",
        "13:00",
        "13:30",
        "14:00",
        "14:30",
        "15:00",
        "15:30",
        "16:00",
      ];
    }

    return [];
  },

  /**
   * Deletes a pet
   * @param petId The ID of the pet to delete
   * @returns Promise that resolves when the pet is deleted
   */
  deletePet: async (petId: number): Promise<void> => {
    try {
      await api.delete(`/pets/${petId}`);
    } catch (error) {
      console.error("Error deleting pet:", error);
      throw error;
    }
  },

  /**
   * Updates an existing pet
   * @param petId The ID of the pet to update
   * @param petData The updated pet data
   * @returns Promise with the updated pet
   */
  updatePet(petId: number, petData: Partial<Pet>): Promise<Pet> {
    return api
      .put<{ data: Pet }>(`/pets/${petId}`, petData)
      .then((response) => response.data.data);
  },

  /**
   * Fetches detailed information about a specific appointment
   * @param appointmentId The ID of the appointment to fetch
   * @returns Promise with the appointment details
   */
  getAppointmentById(appointmentId: string | number): Promise<Appointment> {
    return api
      .get<Appointment>(`/appointments/${appointmentId}`)
      .then((response) => response.data);
  },

  /**
   * Cancels an existing appointment
   * @param appointmentId The ID of the appointment to cancel
   * @returns Promise that resolves when the appointment is cancelled
   */
  cancelAppointment(appointmentId: string | number): Promise<void> {
    return api
      .delete(`/appointments/${appointmentId}`)
      .then((response) => response.data);
  },

  /**
   * Updates an existing appointment
   * @param appointmentId The ID of the appointment to update
   * @param appointmentData The updated appointment data
   * @returns Promise with the updated appointment
   */
  updateAppointment(
    appointmentId: string | number,
    appointmentData: Partial<
      Omit<Appointment, "id" | "pet" | "veterinarian" | "location">
    >
  ): Promise<Appointment> {
    return api
      .put<{ data: Appointment }>(
        `/appointments/${appointmentId}`,
        appointmentData
      )
      .then((response) => response.data.data);
  },

  /**
   * Fetches medical records for a specific pet
   * @param petId The ID of the pet
   * @returns Promise with array of medical records
   */
  getMedicalRecords(petId: string | number): Promise<MedicalRecord[]> {
    return api
      .get<MedicalRecord[]>("/medical-records", {
        params: { pet_id: petId },
      })
      .then((response) => response.data);
  },
};

export default petsApi;
