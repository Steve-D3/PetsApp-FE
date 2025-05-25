import { Card } from "@/components/atoms/Card";
import { useNavigate } from "react-router-dom";
import type { Pet } from "@/features/pets/api/petsApi";

export const PetCard = ({ pet }: { pet: Pet }) => {
  const navigate = useNavigate();
  const age = pet.birth_date
    ? new Date().getFullYear() -
      new Date(pet.birth_date).getFullYear() +
      " years old"
    : "Unknown";

  return (
    <Card
      onClick={() => navigate(`/pets/${pet.id}`)}
      className="cursor-pointer hover:shadow-md transition-shadow"
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/pets/${pet.id}`)}
    >
      <div className="flex items-center space-x-4">
        <img
          src={pet.photo}
          alt={pet.name}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="font-medium text-gray-900">{pet.name}</h3>
          <p className="text-sm text-gray-500">
            {pet.species} • {pet.breed} • {age}
          </p>
        </div>
      </div>
    </Card>
  );
};
