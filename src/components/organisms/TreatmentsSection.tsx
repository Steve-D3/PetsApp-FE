import { useNavigate } from "react-router-dom";
import { TreatmentCard } from "../molecules/TreatmentCard";

interface Treatment {
  id: string;
  name: string;
  nextDue: string;
  icon: React.ReactNode;
}

interface TreatmentsSectionProps {
  treatments: Treatment[];
  onViewAll?: () => void;
  onEditTreatment?: (id: string) => void;
  className?: string;
}

export const TreatmentsSection = ({
  treatments = [],
  onViewAll,
  onEditTreatment,
  className = "",
}: TreatmentsSectionProps) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/treatments");
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Treatments</h3>
        <button
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {treatments.length > 0 ? (
          treatments.map((treatment) => (
            <TreatmentCard
              key={treatment.id}
              id={treatment.id}
              name={treatment.name}
              nextDue={treatment.nextDue}
              icon={treatment.icon}
              onEdit={onEditTreatment}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No treatments found
          </div>
        )}
      </div>
    </div>
  );
};
