// src/components/organisms/AddPetModal.tsx
import { Dialog } from "@/components/atoms/Dialog";
import { PetForm } from "@/components/molecules/PetForm";
import { type PetFormData } from "@/features/pets/types";

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PetFormData) => Promise<void>;
  isLoading?: boolean;
}

export function AddPetModal({ isOpen, onClose, onSubmit }: AddPetModalProps) {
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Pet"
      description="Fill in the details below to add a new pet to your profile."
    >
      <div className="mt-4">
        <PetForm onSubmit={onSubmit} />
      </div>
    </Dialog>
  );
}
