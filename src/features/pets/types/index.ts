import type { ReactNode } from "react";

// Base Pet type
export interface Pet {
  id: number;
  user_id?: number;
  name: string;
  species: string;
  breed?: string;
  gender: 'Male' | 'Female';
  birth_date?: string;
  weight?: number;
  microchip_number?: string;
  sterilized?: number; // 0 or 1 to match the backend
  food_preferences?: string;
  allergies?: string;
  photo?: string | null;
  created_at?: string;
  updated_at?: string;
}
export interface Treatment {
  administered_at: string;
  category: string;
  id: string;
  name: string;
  nextDue: string;
  description?: string;
  cost?: number;
  quantity?: number;
  unit?: string;
  completed?: boolean;
  administered_by?: number;
  treatment_type_id?: number;
  icon: ReactNode; // after adding the import above
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
  birth_date?: string;
  weight?: number;
  microchip_number?: string;
  sterilized?: number; // 0 or 1 to match the backend
  allergies?: string;
  food_preferences?: string;
  photo?: string | File | null;
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
  pet: Pet;
  vet: Veterinarian;
  appointment: Appointment;
  treatments: Treatment[];
  vaccinations: Vaccination[];
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
  name: string;
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
  status: "pending" | "confirmed" | "cancelled"; // align with API
  notes: string | null;
  pet: Pet;
  veterinarian: Veterinarian;
}

export interface Vaccination {
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
  vaccination_type: VaccinationType;
}

export interface VaccinationType {
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
}
