import { Edit, Trash2, PawPrint } from "lucide-react";
import { PetAvatar } from "../atoms/PetAvatar";
import { PetInfo } from "../atoms/PetInfo";
import { Button } from "@/components/atoms/Button";
import { cn } from "@/lib/utils";

interface PetProfileCardProps {
  id: number;
  name: string;
  photoUrl?: string;
  breed?: string;
  gender?: string;
  birthDate?: string;
  onViewHealthRecords?: () => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  className?: string;
  isOwner?: boolean;
}

export const PetProfileCard = ({
  id,
  name,
  photoUrl,
  breed,
  gender,
  birthDate,
  onViewHealthRecords,
  onEdit,
  onDelete,
  className = "",
  isOwner = true,
}: PetProfileCardProps) => {
  const handleEdit = () => {
    if (onEdit) onEdit(id);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(id);
  };

  return (
    <div
      className={cn("bg-white rounded-xl shadow-sm overflow-hidden", className)}
    >
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
      <div className="border-t border-gray-100 p-4 space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={onViewHealthRecords}
        >
          <PawPrint className="h-4 w-4 mr-2 text-blue-500" />
          Health Records
        </Button>

        {isOwner && (
          <div className="grid grid-cols-2 gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4 mr-2 text-gray-600" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full hover:bg-red-50 hover:text-red-600 text-red-500 border-red-200"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
