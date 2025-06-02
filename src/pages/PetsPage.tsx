// src/pages/PetsPage.tsx
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import type { Pet } from "@/features/pets/api/petsApi";
import { useEffect, useState } from "react";
import petsApi from "@/features/pets/api/petsApi";
import { useNavigate } from "react-router-dom";
import type { PetFormData } from "@/features/pets/types";
import { useToast } from "@/components/atoms/use-toast";
import { AddPetModal } from "@/components/organisms/AddPetModal";
import type { AxiosError } from "axios";
import authApi from "@/features/auth/api/authApi";

const PetsPage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isAddPetModalOpen, setIsAddPetModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem("token");

        // Check if user is authenticated
        if (!token) {
          setError("Please log in to view your pets");
          setLoading(false);
          navigate("/login");
          return;
        }

        const response = await petsApi.getUserPets();
        setPets(response);
        setError(null);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes("No authentication token")) {
            setError("Session expired. Please log in again.");
            localStorage.removeItem("auth_token");
          } else {
            setError(`Failed to fetch pets: ${error.message}`);
          }
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [navigate]);

  const handleAddPet = async (data: PetFormData) => {
    try {
      setIsSubmitting(true);
      const user = await authApi.getCurrentUser();
      const userId = user?.data?.id;

      const response = await petsApi.createPet({
        ...data,
        user_id: Number(userId),
      });

      console.log("Pet created successfully:", response);
      toast({
        title: "Success",
        description: "Pet added successfully!",
      });
      setIsAddPetModalOpen(false);

      const updatedPets = await petsApi.getUserPets();
      setPets(updatedPets);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      console.error("Error adding pet:", {
        error,
        response: error.response?.data,
      });
      toast({
        title: "Error",
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to add pet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md mx-4 my-6">
        <p>{error}</p>
        {error.includes("log in") && (
          <button
            onClick={() => navigate("/login")}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Go to Login
          </button>
        )}
      </div>
    );
  }

  const handlePetClick = (petId: number) => {
    navigate(`/profile/${petId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-4 pt-4">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-bold text-gray-900">My Pets</h1>
          <Button
            onClick={() => setIsAddPetModalOpen(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Pet
          </Button>
        </div>
        <p className="text-gray-500 text-sm">
          Manage your pets' profiles and health records
        </p>
      </div>

      <AddPetModal
        isOpen={isAddPetModalOpen}
        onClose={() => setIsAddPetModalOpen(false)}
        onSubmit={handleAddPet}
        isLoading={isSubmitting}
      />

      {/* Pets Grid */}
      <div className="px-4 py-4">
        {pets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pets.map((pet) => (
              <div
                key={pet.id}
                onClick={() => handlePetClick(pet.id)}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={
                      "https://www.pdinsurance.co.nz/wp-content/uploads/2021/03/Labrador-Personality-and-Profile-1.jpg"
                    }
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {pet.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {pet.species || "Pet"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No pets yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first pet
            </p>
            <div className="mt-6">
              <Button
                onClick={() => navigate("/pets/new")}
                className="inline-flex items-center"
              >
                <Plus className="-ml-1 mr-2 h-4 w-4" />
                Add Pet
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetsPage;
