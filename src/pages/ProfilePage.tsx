import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BriefcaseMedical, Pill } from "lucide-react";
import axios from "axios";
import type { PetFormData } from "@/features/pets/types";
import type { MedicalRecord } from "@/features/pets/api/petsApi";
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
  HealthRecordsModal,
} from "@/components/organisms";

// Import types from the API
import type { Pet as ApiPet } from "../features/pets/api/petsApi";

// Pet interface that extends the API Pet to allow both number and string for weight
interface Pet extends Omit<ApiPet, "weight"> {
  weight: number | string; // Allow both number and string for weight
}

// Using types from @/features/pets/types

const ProfilePage = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  // Loading state
  const isPageLoading = false; // Removed state since it was always true and never updated
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(true);
  const [isHealthRecordsModalOpen, setIsHealthRecordsModalOpen] =
    useState(false);
  const [isLoadingHealthRecords, setIsLoadingHealthRecords] = useState(false);
  // State for tracking delete operation
  const [isDeleting, setIsDeleting] = useState(false);

  // Navigation handlers
  const handleViewAllTreatments = useCallback(
    () => navigate("/treatments"),
    [navigate]
  );
  const handleViewAllMedications = useCallback(
    () => navigate("/medications"),
    [navigate]
  );
  const handleViewAllVaccines = useCallback(() => {
    if (petId) navigate(`/pets/${petId}/vaccines`);
  }, [navigate, petId]);

  const { toast } = useToast();

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const token = localStorage.getItem("token");

        // Check if user is authenticated
        if (!token) {
          setError("Please log in to view your pets");
          navigate("/login");
          return;
        }
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
      }
    };

    fetchPet();
  }, [navigate, petId]);

  // Track the last fetched pet ID to prevent unnecessary re-fetches
  const lastFetchedPetId = useRef<number | null>(null);

  // Fetch medical records when pet changes
  useEffect(() => {
    // Skip if no pet or if we've already fetched for this pet
    if (!pet?.id || lastFetchedPetId.current === pet.id) {
      return;
    }

    let isMounted = true;
    const controller = new AbortController();

    const fetchMedicalRecords = async () => {
      try {
        setIsLoadingRecords(true);
        const records = await petsApi.getMedicalRecords(pet.id);

        // Only update state if component is still mounted
        if (isMounted) {
          setMedicalRecords(records);
          lastFetchedPetId.current = pet.id; // Update the last fetched pet ID
        }
      } catch (error) {
        // Don't log cancellation errors
        if (axios.isCancel(error)) {
          return;
        }

        console.error("Error fetching medical records:", error);
        if (isMounted) {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              error instanceof Error
                ? error.message
                : "Failed to load medical records.",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingRecords(false);
        }
      }
    };

    // Add a small debounce to prevent rapid refetches
    const timer = setTimeout(() => {
      fetchMedicalRecords();
    }, 100);

    // Cleanup function
    return () => {
      isMounted = false;
      controller.abort("Component unmounted or pet changed");
      clearTimeout(timer);
    };
  }, [pet?.id, toast]); // Only depend on pet.id and toast

  // Memoize the transformation of medical records to prevent unnecessary recalculations
  const treatments = useMemo(() => {
    const formatDate = (dateString: string): string => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? "N/A" : date.toISOString().split("T")[0];
    };

    return medicalRecords.flatMap((record) =>
      (record.treatments || []).map((treatment) => ({
        id: Number(treatment.id),
        medical_record_id: record.id,
        name: treatment.name,
        category: treatment.category || "Unknown",
        description: treatment.description || "No description available",
        cost: treatment.cost?.toString() || "0",
        quantity: treatment.quantity?.toString() || "0",
        unit: treatment.unit || "",
        completed: Boolean(treatment.completed),
        administered_at: treatment.administered_at
          ? formatDate(treatment.administered_at)
          : "N/A",
        administered_by: Number(treatment.administered_by) || 0,
        treatment_type_id: Number(treatment.treatment_type_id) || 0,
        vet: record.vet?.license_number || "Unknown",
        icon: <BriefcaseMedical className="h-5 w-5 text-blue-500" />,
      }))
    );
  }, [medicalRecords]);

  // Memoize medications
  // Helper function to parse medication name and dosage from a string
  const parseMedication = (medString: string) => {
    // Split the string into parts
    const parts = medString.trim().split(/\s+/);
    if (parts.length < 2) {
      return {
        name: medString.trim(),
        dosage: "N/A",
        frequency: "As needed",
      };
    }

    // The first part is the medication name
    const name = parts[0];
    // The rest is the dosage and frequency
    const dosageAndFreq = parts.slice(1).join(" ");

    // Try to split dosage and frequency
    const freqMatch = dosageAndFreq.match(/(.+?)\s*,\s*(.+)/);

    if (freqMatch) {
      return {
        name: name,
        dosage: freqMatch[1].trim(),
        frequency: freqMatch[2].trim(),
      };
    }

    // If no frequency specified, use default
    return {
      name: name,
      dosage: dosageAndFreq,
      frequency: "As needed",
    };
  };

  const medications = medicalRecords.flatMap((record) => {
    if (!record.medications) return [];

    // If medications is a string but not a JSON array, treat it as a single medication
    if (typeof record.medications === "string") {
      try {
        // Try to parse as JSON first
        const parsed = JSON.parse(record.medications);
        // If it's an array, use it as is
        if (Array.isArray(parsed)) {
          return parsed.map((med, index) => {
            const medData =
              typeof med === "string"
                ? parseMedication(med)
                : {
                    name: med.name || med.medication || "Unknown Medication",
                    dosage: med.dosage || med.dose || "N/A",
                    frequency: med.frequency || "As needed",
                  };

            return {
              id: `med-${record.id}-${index}`,
              name: medData.name,
              dosage: medData.dosage,
              frequency: medData.frequency,
              startDate: med.startDate || med.date || record.record_date,
              endDate: med.endDate || "",
              icon: <Pill className="h-5 w-5 text-purple-500" />,
            };
          });
        }

        // If it's a single medication object or string
        const medData =
          typeof parsed === "string"
            ? parseMedication(parsed)
            : {
                name: parsed.name || parsed.medication || "Unknown Medication",
                dosage: parsed.dosage || parsed.dose || "N/A",
                frequency: parsed.frequency || "As needed",
              };

        return [
          {
            id: `med-${record.id}-0`,
            name: medData.name,
            dosage: medData.dosage,
            frequency: medData.frequency,
            startDate: parsed.startDate || parsed.date || record.record_date,
            endDate: parsed.endDate || "",
            icon: <Pill className="h-5 w-5 text-purple-500" />,
          },
        ];
      } catch {
        // If parsing fails, treat the whole string as a medication name
        const medData = parseMedication(record.medications);
        return [
          {
            id: `med-${record.id}-0`,
            name: medData.name,
            dosage: medData.dosage,
            frequency: medData.frequency,
            startDate: record.record_date,
            endDate: "",
            icon: <Pill className="h-5 w-5 text-purple-500" />,
          },
        ];
      }
    }
    return [];
  });

  // Get all non-medication vaccines
  const vaccines = medicalRecords.flatMap((record) =>
    (record.vaccinations || [])
      .filter((vaccine) => vaccine.vaccination_type?.category !== "Medication")
      .map((vaccine) => ({
        ...vaccine,
        next_due_date: vaccine.next_due_date || "", // Ensure next_due_date is not null
        reaction_details: vaccine.reaction_details || "", // Ensure reaction_details is not null
      }))
  ) as unknown as import("@/features/pets/types").Vaccination[];

  const handleViewAllHealthRecords = useCallback(async () => {
    if (!pet) return;

    try {
      setIsLoadingHealthRecords(true);
      const records = await petsApi.getMedicalRecords(pet.id);
      setMedicalRecords(records);
      setIsHealthRecordsModalOpen(true);
    } catch (error) {
      console.error("Failed to fetch health records:", error);
      toast({
        title: "Error",
        description: "Failed to load health records. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHealthRecords(false);
    }
  }, [pet, setMedicalRecords, setIsHealthRecordsModalOpen, toast]);

  if (isPageLoading || isLoadingHealthRecords || isDeleting) {
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
      setIsDeleting(true);

      // Call the API to delete the pet
      await petsApi.deletePet(Number(id));

      // Show success message
      toast({
        title: "Success",
        description: "Pet deleted successfully",
        variant: "default",
      });

      // Redirect to the pets list page
      navigate("/pets");
    } catch (error) {
      console.error("Error deleting pet:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while deleting the pet.";
      setError(`Failed to delete pet: ${errorMessage}`);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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
      const updateData: Partial<Pet> & { photo?: string | File } = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        gender: formData.gender,
        birth_date: formData.birth_date,
        weight: formData.weight,
        microchip_number: formData.microchip_number,
        sterilized: formData.sterilized,
        allergies: formData.allergies,
        food_preferences: formData.food_preferences,
      };

      // Handle photo upload if a new photo was provided
      if (formData.photo) {
        if (formData.photo instanceof File) {
          // If it's a File object, we need to upload it first
          const formDataToUpload = new FormData();
          formDataToUpload.append("photo", formData.photo);

          const uploadResponse = await axios.post<{ url: string }>(
            `${import.meta.env.VITE_API_URL}/api/pets/${pet.id}/upload-photo`,
            formDataToUpload,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          updateData.photo = uploadResponse.data.url;
        } else {
          // If it's already a string (URL), use it as is
          updateData.photo = formData.photo;
        }
      }

      // Call the API to update the pet
      const updatedPet = await petsApi.updatePet(
        pet.id,
        updateData as Partial<Pet>
      );

      // Update the pet in state
      setPet(updatedPet);

      // Close the modal
      setIsEditModalOpen(false);

      // Show success message
      toast({
        title: "Success",
        description: "Pet updated successfully",
        variant: "default",
      });
    } catch (error) {
      console.error("Error updating pet:", error);
      setError(error instanceof Error ? error.message : "Failed to update pet");
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update pet",
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
          {/* Modals */}
          {pet && (
            <>
              <EditPetModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSavePet}
                pet={pet}
                isLoading={isSaving}
              />
              <HealthRecordsModal
                isOpen={isHealthRecordsModalOpen}
                onClose={() => setIsHealthRecordsModalOpen(false)}
                records={medicalRecords}
                isLoading={isLoadingHealthRecords}
              />
            </>
          )}
          {/* Left Column - Profile Card and Quick Stats */}
          <div className="space-y-6">
            <PetProfileCard
              id={pet.id}
              name={pet.name}
              breed={pet.breed}
              gender={pet.gender}
              birthDate={pet.birth_date}
              photoUrl={pet.photo || ""}
              onViewHealthRecords={handleViewAllHealthRecords}
              onEdit={handleEditPet}
              onDelete={handleDeletePet}
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
              isLoading={isLoadingRecords}
            />

            <MedicationsSection
              medications={medications}
              onViewAll={handleViewAllMedications}
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
