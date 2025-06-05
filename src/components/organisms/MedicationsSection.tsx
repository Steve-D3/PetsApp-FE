import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MedicationCard } from "../molecules/MedicationCard";
import { DetailModal } from "./DetailModal";

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
  icon: React.ReactNode;
  prescribedBy?: string;
  notes?: string;
}

interface MedicationsSectionProps {
  medications: Medication[];
  onViewAll?: () => void;
  onEditMedication?: never;
  onDeleteMedication?: never;
  isLoading?: boolean;
  className?: string;
}

export const MedicationsSection = ({
  medications = [],
  onViewAll,
  isLoading = false,
  className = "",
}: MedicationsSectionProps) => {
  const navigate = useNavigate();
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/medications");
    }
  };

  const handleMedicationClick = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsModalOpen(true);
  };

  const getDetails = (med: Medication): { label: string; value: string }[] => [
    { label: 'Name', value: med.name },
    { label: 'Dosage', value: med.dosage },
    { label: 'Frequency', value: med.frequency },
    { label: 'Start Date', value: med.startDate || 'Not specified' },
    { label: 'End Date', value: med.endDate || 'Not specified' },
    { label: 'Prescribed By', value: med.prescribedBy || 'Not specified' },
    { label: 'Notes', value: med.notes || 'No additional notes' },
  ];

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
          <button
            className="text-sm text-blue-600 hover:text-blue-800"
            onClick={handleViewAll}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'View All'}
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading medications...</div>
          ) : medications.length > 0 ? (
            medications.map((medication) => (
              <div 
                key={medication.id} 
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleMedicationClick(medication)}
              >
                <MedicationCard
                  name={medication.name}
                  dosage={medication.dosage}
                  frequency={medication.frequency}
                  icon={medication.icon}
                />
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No medications found</div>
          )}
        </div>
      </div>

      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedMedication?.name || 'Medication Details'}
        description={`Details for ${selectedMedication?.name || 'this medication'}`}
        details={selectedMedication ? getDetails(selectedMedication) : []}
      />
    </>
  );
};
