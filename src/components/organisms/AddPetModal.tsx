// src/components/organisms/AddPetModal.tsx
import { Dialog } from "@/components/atoms/Dialog";
import { PetForm } from "@/components/molecules/PetForm";
import { type PetFormData } from "@/features/pets/types";
import { useEffect, useState } from "react";
import authApi from "@/features/auth/api/authApi";

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PetFormData) => Promise<void>;
  isLoading?: boolean;
}

export function AddPetModal({ isOpen, onClose, onSubmit, isLoading }: AddPetModalProps) {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await authApi.getCurrentUser();
        if (user?.id) {
          setCurrentUserId(Number(user.id));
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };

    if (isOpen) {
      fetchCurrentUser();
    }
  }, [isOpen]);

  if (isLoadingUser) {
    return (
      <Dialog isOpen={isOpen} onClose={onClose} title="Add New Pet">
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Pet"
      description="Fill in the details below to add a new pet to your profile."
    >
      <div className="mt-4">
        <PetForm 
          onSubmit={onSubmit} 
          initialData={currentUserId ? { user_id: currentUserId } : {}}
          isSubmitting={isLoading}
        />
      </div>
    </Dialog>
  );
}
