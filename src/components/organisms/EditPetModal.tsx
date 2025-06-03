import { PetForm } from "@/components/molecules/PetForm";
import { Dialog } from "@/components/atoms/Dialog";
import type { Pet } from "@/features/pets/api/petsApi";
import type { PetFormData } from "@/features/pets/types";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface EditPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PetFormData) => Promise<void>;
  pet: Pet | null;
  isLoading?: boolean;
}

export function EditPetModal({
  isOpen,
  onClose,
  onSave,
  pet,
  isLoading = false,
}: EditPetModalProps) {
  const { user } = useAuth();

  if (!pet || !user) return null;

  // Transform pet data to match form data format
  // Ensure user ID is a number
  const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;

  const initialData: PetFormData = {
    user_id: userId,
    name: pet.name || "",
    species: pet.species || "",
    breed: pet.breed,
    gender: (pet.gender as "Male" | "Female") || "Male",
    birth_date: pet.birth_date,
    weight: typeof pet.weight === 'number' ? pet.weight : 
           typeof pet.weight === 'string' ? parseFloat(pet.weight) || 0 : 0,
    microchip_number: pet.microchip_number,
    sterilized: Boolean(pet.sterilized),
    allergies: pet.allergies,
    food_preferences: pet.food_preferences,
    photo: pet.photo
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit ${pet.name}'s Profile`}
      description="Update your pet's information below."
    >
      <div className="mt-4">
        <PetForm
          onSubmit={onSave}
          initialData={initialData}
          isLoading={isLoading}
          onCancel={onClose}
        />
      </div>
    </Dialog>
  );
}
