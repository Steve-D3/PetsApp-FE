import { PawPrint } from "lucide-react";
import { PetAvatar } from "../atoms/PetAvatar";
import { PetInfo } from "../atoms/PetInfo";
import { Button } from "@/components/atoms/Button";

interface PetProfileCardProps {
  name: string;
  photoUrl?: string;
  breed?: string;
  gender?: string;
  birthDate?: string;
  onViewHealthRecords?: () => void;
  className?: string;
}

export const PetProfileCard = ({
  name,
  photoUrl,
  breed,
  gender,
  birthDate,
  onViewHealthRecords,
  className = "",
}: PetProfileCardProps) => (
  <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
    <div className="p-6 text-center">
      <div className="flex justify-center mb-4">
        <PetAvatar
          photoUrl={photoUrl}
          name={name}
          size="lg"
          className="mx-auto"
        />
      </div>
      <PetInfo
        name={name}
        breed={breed}
        gender={gender}
        birthDate={birthDate}
      />
    </div>
    <div className="border-t border-gray-100 p-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={onViewHealthRecords}
      >
        <PawPrint className="h-4 w-4 mr-2 text-blue-500" />
        View Health Records
      </Button>
    </div>
  </div>
);
