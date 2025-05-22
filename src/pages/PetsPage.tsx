// src/pages/PetsPage.tsx
import { Plus } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { PetCard } from "@/components/molecules/PetCard";
import type { Pet } from "@/lib/types/types.d";

// Mock data - replace with API call in a real app
const mockPets: Pet[] = [
  {
    id: "1",
    name: "Max",
    type: "Dog",
    breed: "Golden Retriever",
    age: 3,
    imageUrl:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
  },
  {
    id: "2",
    name: "Bella",
    type: "Cat",
    breed: "Siamese",
    age: 2,
    imageUrl:
      "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
  },
  {
    id: "3",
    name: "Charlie",
    type: "Dog",
    breed: "Beagle",
    age: 5,
    imageUrl:
      "https://images.unsplash.com/photo-1537151609928-444daf119cea?w=400",
  },
];

const PetsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">My Pets</h2>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          Add Pet
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockPets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </div>
  );
};

export default PetsPage;
