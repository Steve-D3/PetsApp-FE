import type { TreatmentCardProps } from "@/features/pets/types/treatment";

export const TreatmentCard = ({
  name,
  administered_at,
  icon,
  className = "",
}: TreatmentCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // The main card click is handled by the parent component
  };

  return (
    <div className={`p-4 hover:bg-gray-50 transition-colors ${className}`}>
      <div className="flex items-start">
        <div className="bg-blue-50 p-2 rounded-lg mr-3">{icon}</div>
        <div className="flex-1 cursor-pointer" onClick={handleClick}>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">Date: {administered_at}</p>
        </div>
      </div>
    </div>
  );
};
