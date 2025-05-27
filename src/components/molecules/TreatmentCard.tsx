import { ReactNode } from 'react';
import { Pencil } from 'lucide-react';

interface TreatmentCardProps {
  id: string;
  name: string;
  nextDue: string;
  icon: ReactNode;
  onEdit?: (id: string) => void;
  className?: string;
}

export const TreatmentCard = ({
  id,
  name,
  nextDue,
  icon,
  onEdit,
  className = ''
}: TreatmentCardProps) => (
  <div 
    className={`p-4 hover:bg-gray-50 transition-colors ${className}`}
    onClick={() => onEdit?.(id)}
  >
    <div className="flex items-start cursor-pointer">
      <div className="bg-blue-50 p-2 rounded-lg mr-3">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-900">
          {name}
        </p>
        <p className="text-sm text-gray-500">
          Next due: {nextDue}
        </p>
      </div>
      <button 
        className="text-gray-400 hover:text-gray-600"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(id);
        }}
      >
        <Pencil className="h-4 w-4" />
      </button>
    </div>
  </div>
);
