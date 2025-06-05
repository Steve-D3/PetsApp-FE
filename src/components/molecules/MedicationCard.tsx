import type { ReactNode } from "react";

interface MedicationCardProps {
  id?: string;  // Made optional as it's not used in the component
  name: string;
  dosage: string;
  frequency: string;
  icon: ReactNode;
  className?: string;
}

export const MedicationCard = ({
  name,
  dosage,
  frequency,
  icon,
  className = "",
}: MedicationCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // The main card click is handled by the parent component
  };

  return (
    <div className={`p-4 hover:bg-gray-50 transition-colors ${className}`}>
      <div className="flex items-start">
        <div className="bg-purple-50 p-2 rounded-lg mr-3">{icon}</div>
        <div className="flex-1 cursor-pointer" onClick={handleClick}>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">{dosage}</p>
          <p className="text-xs text-gray-400">{frequency}</p>
        </div>
      </div>
    </div>
  );
};
