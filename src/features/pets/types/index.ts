// Base Pet type
export interface Pet {
  id: number;
  name: string;
  species?: string;
  breed?: string;
  gender?: string;
  birth_date?: string;
  weight?: string | number;
  food_preferences?: string;
  allergies?: string;
  photo?: string;
  created_at?: string;
  updated_at?: string;
}

// Treatment type
export interface Treatment {
  id: string;
  name: string;
  nextDue: string;
  icon: React.ReactNode;
}

// Medication type
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  icon: React.ReactNode;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Pagination type
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface PetFormData {
  user_id: number;
  name: string;
  species: string;
  breed?: string;
  gender: "Male" | "Female";
  birth_date?: string; // Format: YYYY-MM-DD
  weight?: number;
  microchip_number?: string;
  sterilized?: boolean;
  allergies?: string;
  food_preferences?: string;
  photo?: string;
}

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
  off_days: string; // JSON string array
  clinic: Clinic;
}

export interface Appointment {
  id: number;
  pet_id: number;
  veterinarian_id: number;
  start_time: string; // ISO 8601 datetime string
  end_time: string; // ISO 8601 datetime string
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  notes: string | null;
  pet: Pet;
  veterinarian: Veterinarian;
}
