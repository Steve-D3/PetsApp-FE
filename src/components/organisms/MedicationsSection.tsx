import { useNavigate } from "react-router-dom";
import { MedicationCard } from "../molecules/MedicationCard";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  icon: React.ReactNode;
}

interface MedicationsSectionProps {
  medications: Medication[];
  onViewAll?: () => void;
  onEditMedication?: (id: string) => void;
  className?: string;
}

export const MedicationsSection = ({
  medications = [],
  onViewAll,
  onEditMedication,
  className = "",
}: MedicationsSectionProps) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/medications");
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
        <button
          className="text-sm text-blue-600 hover:text-blue-800"
          onClick={handleViewAll}
        >
          View All
        </button>
      </div>
      <div className="divide-y divide-gray-100">
        {medications.length > 0 ? (
          medications.map((medication) => (
            <MedicationCard
              key={medication.id}
              id={medication.id}
              name={medication.name}
              dosage={medication.dosage}
              frequency={medication.frequency}
              icon={medication.icon}
              onEdit={onEditMedication}
            />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">
            No medications found
          </div>
        )}
      </div>
    </div>
  );
};
