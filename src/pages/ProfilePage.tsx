import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pill, PawPrint } from "lucide-react";
import type { PetFormData } from "@/features/pets/types";
import { Button } from "@/components/atoms/Button";
import petsApi, { type Pet } from "@/features/pets/api/petsApi";
import {
  PetProfileCard,
  PetQuickStats,
  TreatmentsSection,
  MedicationsSection,
  VaccinesSection,
  EditPetModal,
} from "@/components/organisms";
import { useToast } from "@/components/atoms/use-toast";

type Treatment = {
  id: string;
  name: string;
  nextDue: string;
  icon: React.ReactNode;
};

type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  icon: React.ReactNode;
};

// Mock data - this will be replaced with real data later
const MOCK_TREATMENTS: Treatment[] = [
  {
    id: "1",
    name: "Flea and Tick Prevention",
    nextDue: "Mar 31, 2023",
    icon: <PawPrint className="h-5 w-5 text-blue-500" />,
  },
  {
    id: "2",
    name: "Heartworm Prevention",
    nextDue: "Mar 31, 2023",
    icon: <PawPrint className="h-5 w-5 text-green-500" />,
  },
];

const MOCK_VACCINES = [
  {
    id: "v1",
    name: "Rabies",
    nextDue: "Nov 15, 2023",
    status: "upcoming" as const,
    lastAdministered: "Nov 15, 2022",
  },
  {
    id: "v2",
    name: "Distemper",
    nextDue: "Sep 30, 2023",
    status: "overdue" as const,
    lastAdministered: "Mar 30, 2023",
  },
  {
    id: "v3",
    name: "Bordetella",
    nextDue: "Dec 1, 2023",
    status: "upcoming" as const,
    lastAdministered: "Jun 1, 2023",
  },
];

const MOCK_MEDICATIONS: Medication[] = [
  {
    id: "1",
    name: "Apoquel",
    dosage: "30mg",
    frequency: "1 tablet every 12 hours",
    icon: <Pill className="h-5 w-5 text-purple-500" />,
  },
  {
    id: "2",
    name: "Zyrtec",
    dosage: "10mg",
    frequency: "1 tablet every 24 hours",
    icon: <Pill className="h-5 w-5 text-purple-500" />,
  },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { petId } = useParams<{ petId: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleViewHealthRecords = () => {
    console.log("View health records");
    // Navigate to health records page
  };

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

  const handleDeletePet = async (id: number): Promise<void> => {
    try {
      // Confirm before deleting
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this pet? This action cannot be undone."
      );

      if (!confirmDelete) return;

      // Show loading state
      setLoading(true);

      // Call the API to delete the pet
      await petsApi.deletePet(id);

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
              onViewHealthRecords={() => handleViewHealthRecords()}
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
              treatments={MOCK_TREATMENTS}
              onViewAll={handleViewAllTreatments}
              onEditTreatment={handleEditTreatment}
            />

            <MedicationsSection
              medications={MOCK_MEDICATIONS}
              onViewAll={handleViewAllMedications}
              onEditMedication={handleEditMedication}
            />

            <VaccinesSection
              vaccines={MOCK_VACCINES}
              onViewAll={handleViewAllVaccines}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
