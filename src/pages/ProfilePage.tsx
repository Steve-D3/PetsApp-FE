import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pill, PawPrint } from "lucide-react";
import type { MedicalRecord, PetFormData } from "@/features/pets/types";
import { Button } from "@/components/atoms/Button";
import petsApi from "@/features/pets/api/petsApi";
import { useToast } from "@/components/atoms/use-toast";
import {
  PetProfileCard,
  PetQuickStats,
  TreatmentsSection,
  MedicationsSection,
  VaccinesSection,
  EditPetModal,
} from "@/components/organisms";

type TreatmentItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  date: string;
  nextDue: string;
  icon: React.ReactNode;
};

// Import types from the API
import type { Pet as ApiPet } from "../features/pets/api/petsApi";

// Pet interface that extends the API Pet to allow both number and string for weight
interface Pet extends Omit<ApiPet, "weight"> {
  weight: number | string; // Allow both number and string for weight
}

interface VaccinationType {
  id: number;
  name: string;
  category: string;
  for_species: string;
  description: string;
  default_validity_period: number;
  is_required_by_law: boolean;
  minimum_age_days: number;
  administration_protocol: string | null;
  common_manufacturers: string;
  requires_booster: boolean;
  booster_waiting_period?: number;
  default_administration_route: string;
  default_cost: number;
  created_at: string;
  updated_at: string;
}

interface Vaccination {
  id: number;
  pet_id: number;
  medical_record_id: number;
  vaccine_type_id: number;
  manufacturer: string;
  batch_number: string;
  serial_number: string;
  expiration_date: string;
  administration_date: string;
  next_due_date: string | null;
  administered_by?: number;
  administration_site: string;
  administration_route: string;
  dose: number;
  dose_unit: string;
  is_booster: boolean;
  certification_number?: string;
  reaction_observed: boolean;
  reaction_details: string | null;
  notes?: string;
  cost: number;
  reminder_sent: boolean;
  created_at: string;
  updated_at: string;
  vaccination_type: VaccinationType;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const token = localStorage.getItem("token");

        // Check if user is authenticated
        if (!token) {
          setError("Please log in to view your pets");
          setLoading(false);
          navigate("/login");
          return;
        }

        console.log(petId);
        const response = await petsApi.getPetById(Number(petId));
        setPet(response);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("No authentication token")) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("token");
          } else {
            setError(`Failed to fetch pet: ${error.message}`);
          }
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [navigate, petId]);

  const fetchMedicalRecords = useCallback(async () => {
    if (!pet) return;

    const currentPetId = pet.id;
    const hasRecordsForThisPet = medicalRecords.some(
      (record) => record.pet.id === currentPetId
    );
    if (hasRecordsForThisPet) return;

    setIsLoadingRecords(true);
    try {
      const records = await petsApi.getMedicalRecords(currentPetId);
      setMedicalRecords(records);
    } catch (error) {
      console.error("Error fetching medical records:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load medical records.",
      });
    } finally {
      setIsLoadingRecords(false);
    }
  }, [pet, medicalRecords, toast]);

  // Fetch medical records when pet data is loaded or changes
  useEffect(() => {
    const loadMedicalRecords = async () => {
      if (pet) {
        await fetchMedicalRecords();
      }
    };

    loadMedicalRecords();
  }, [pet, fetchMedicalRecords]);

  // Transform medical records data for the UI
  const treatments: TreatmentItem[] = medicalRecords.flatMap((record) =>
    (record.treatments || []).map((treatment) => ({
      id: treatment.id.toString(),
      name: treatment.name,
      category: treatment.category,
      description: treatment.description,
      date: record.record_date,
      nextDue: record.follow_up_date || "N/A",
      icon: <PawPrint className="h-5 w-5 text-blue-500" />,
      vet: record.vet?.name || "Unknown",
    }))
  );

  const medications = medicalRecords.flatMap((record) => {
    // If medications is a JSON string, parse it
    let meds = [];
    try {
      meds = record.medications ? JSON.parse(record.medications) : [];
    } catch (e) {
      // If it's not valid JSON, treat it as a simple string
      console.error("Error parsing medications:", e);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load medications.",
      });
      if (record.medications) {
        meds = [{ name: record.medications }];
      }
    }

    // If meds is not an array at this point, make it an empty array
    if (!Array.isArray(meds)) {
      meds = [];
    }

    return meds.map((med: any) => ({
      id: Math.random().toString(), // Generate a unique ID since we don't have one
      name: med.name || "Unknown Medication",
      dosage: med.dosage || med.dose || "N/A",
      frequency: med.frequency || "As needed",
      startDate: med.startDate || record.record_date,
      endDate: med.endDate || "",
      icon: <Pill className="h-5 w-5 text-purple-500" />,
    }));
  });

  // Get all non-medication vaccines
  const vaccines = medicalRecords.flatMap((record) =>
    (record.vaccinations || []).filter(
      (vaccine) => vaccine.vaccination_type?.category !== "Medication"
    )
  ) as unknown as Vaccination[];

  const handleViewAllHealthRecords = useCallback(() => {
    if (!pet) return;

    console.log("Refreshing medical records...");
    fetchMedicalRecords();
  }, [pet, fetchMedicalRecords]);

  const handleViewAllTreatments = () => {
    console.log("View all treatments");
    // Navigate to treatments page
  };

  const handleEditTreatment = (id: string) => {
    console.log("Edit treatment:", id);
    // Open edit treatment modal or navigate to edit page
  };

  const handleViewAllMedications = () => {
    console.log("View all medications");
    // Navigate to medications page
  };

  const handleEditMedication = (id: string) => {
    console.log("Edit medication:", id);
    // Open edit medication modal or navigate to edit page
  };

  const handleViewAllVaccines = () => {
    console.log("View all vaccines");
    // Navigate to vaccines page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md mx-4 my-6">
        <p>{error}</p>
        {error.includes("log in") && (
          <Button onClick={() => navigate("/login")} className="mt-2">
            Log In
          </Button>
        )}
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md mx-4 my-6">
        Pet not found
      </div>
    );
  }

  const handleDeletePet = async (id: string | number): Promise<void> => {
    try {
      // Confirm before deleting
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this pet? This action cannot be undone."
      );

      if (!confirmDelete) return;

      // Show loading state
      setLoading(true);

      // Call the API to delete the pet
      await petsApi.deletePet(Number(id));

      // Show success message
      alert("Pet deleted successfully");

      // Redirect to the pets list page
      navigate("/pets");
    } catch (error) {
      console.error("Error deleting pet:", error);
      setError(
        error instanceof Error
          ? `Failed to delete pet: ${error.message}`
          : "An unexpected error occurred while deleting the pet."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditPet = (): void => {
    setIsEditModalOpen(true);
  };

  const handleSavePet = async (formData: PetFormData): Promise<void> => {
    if (!pet) return;

    try {
      setIsSaving(true);

      // Prepare the data for the API call
      const updateData: Partial<Pet> = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        gender: formData.gender,
        birth_date: formData.birth_date,
        weight: formData.weight,
        microchip_number: formData.microchip_number,
        sterilized: formData.sterilized ? 1 : 0,
        allergies: formData.allergies,
        food_preferences: formData.food_preferences,
      };

      // Call the API to update the pet
      const updatedPet = await petsApi.updatePet(pet.id, updateData);

      // Update the local state with the new data
      setPet(updatedPet);

      // Close the edit modal
      setIsEditModalOpen(false);

      // Show success message
      toast({
        title: "Success",
        description: "Pet updated successfully!",
        variant: "success",
      });

      // Close the modal
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating pet:", error);
      toast({
        title: "Error",
        description: "Failed to update pet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Edit Pet Modal */}
          {pet && (
            <EditPetModal
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSave={handleSavePet}
              pet={pet}
              isLoading={isSaving}
            />
          )}
          {/* Left Column - Profile Card and Quick Stats */}
          <div className="space-y-6">
            <PetProfileCard
              id={pet.id}
              name={pet.name}
              breed={pet.breed}
              gender={pet.gender}
              birthDate={pet.birth_date}
              photoUrl={pet.photo}
              onViewHealthRecords={handleViewAllHealthRecords}
              onEdit={handleEditPet}
              onDelete={(id) => handleDeletePet(id)}
            />

            <PetQuickStats
              weight={pet.weight}
              foodPreferences={pet.food_preferences}
              allergies={pet.allergies}
            />
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-3 space-y-6">
            <TreatmentsSection
              treatments={treatments}
              onViewAll={handleViewAllTreatments}
              onEditTreatment={handleEditTreatment}
              isLoading={isLoadingRecords}
            />

            <MedicationsSection
              medications={medications}
              onViewAll={handleViewAllMedications}
              onEditMedication={handleEditMedication}
              isLoading={isLoadingRecords}
            />

            <VaccinesSection
              vaccines={vaccines}
              onViewAll={handleViewAllVaccines}
              isLoading={isLoadingRecords}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
