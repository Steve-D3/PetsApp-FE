import { Card } from "@/components/atoms/Card";
import { useNavigate } from "react-router-dom";
import type { Pet } from "@/lib/types/types.d";

export const PetCard = ({ pet }: { pet: Pet }) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/profile`)}
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center space-x-4">
        <img
          src={pet.imageUrl}
          alt={pet.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-medium text-gray-900">{pet.name}</h3>
          <p className="text-sm text-gray-500">
            {pet.type} • {pet.breed} • {pet.age} years old
          </p>
        </div>
      </div>
    </Card>
  );
};
