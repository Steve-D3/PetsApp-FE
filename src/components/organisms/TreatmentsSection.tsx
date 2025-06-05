import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TreatmentCard } from "../molecules/TreatmentCard";
import { DetailModal } from "./DetailModal";
import type { TreatmentsSectionProps } from "@/features/pets/types/treatment";

export const TreatmentsSection = ({
  treatments = [],
  onViewAll,
  isLoading = false,
  className = "",
}: TreatmentsSectionProps) => {
  const navigate = useNavigate();
  const [selectedTreatment, setSelectedTreatment] = useState<typeof treatments[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      navigate("/treatments");
    }
  };

  const handleTreatmentClick = (treatment: typeof treatments[0]) => {
    setSelectedTreatment(treatment);
    setIsModalOpen(true);
  };

  const getDetails = (treatment: typeof treatments[0]) => [
    { label: 'Name', value: treatment.name },
    { label: 'Category', value: treatment.category || 'Not specified' },
    { label: 'Description', value: treatment.description || 'No description available' },
    { label: 'Administered On', value: treatment.administered_at || 'Not specified' },
    { label: 'Administered By', value: treatment.vet || 'Not specified' },
  ];

  return (
    <>
      <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Treatments</h3>
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
            <div className="p-4 text-center text-gray-500">Loading treatments...</div>
          ) : treatments.length > 0 ? (
            treatments.map((treatment) => (
              <div 
                key={treatment.id}
                onClick={() => handleTreatmentClick(treatment)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <TreatmentCard
                  name={treatment.name}
                  administered_at={treatment.administered_at}
                  icon={treatment.icon}
                />
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No treatments found
            </div>
          )}
        </div>
      </div>

      <DetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTreatment?.name || 'Treatment Details'}
        description={`Details for ${selectedTreatment?.name || 'this treatment'}`}
        details={selectedTreatment ? getDetails(selectedTreatment) : []}
      />
    </>
  );
};
