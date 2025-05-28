import type { ReactNode } from "react";
import { Search } from "lucide-react";

interface MedicationCardProps {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  icon: ReactNode;
  onEdit?: (id: string) => void;
  className?: string;
}

export const MedicationCard = ({
  id,
  name,
  dosage,
  frequency,
  icon,
  onEdit,
  className = "",
}: MedicationCardProps) => (
  <div
    className={`p-4 hover:bg-gray-50 transition-colors ${className}`}
    onClick={() => onEdit?.(id)}
  >
    <div className="flex items-start cursor-pointer">
      <div className="bg-purple-50 p-2 rounded-lg mr-3">{icon}</div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">
          {name} <span className="text-sm text-gray-500">({dosage})</span>
        </p>
        <p className="text-sm text-gray-500">{frequency}</p>
      </div>
      <button
        className="text-gray-400 hover:text-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(id);
        }}
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  </div>
);
