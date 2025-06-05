import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MedicationCard } from "../molecules/MedicationCard";
import { DetailModal } from "./DetailModal";
import { ViewAllModal, type ItemType } from "./ViewAllModal";
import { Calendar, Pill } from "lucide-react";

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

// Extend ItemType to ensure compatibility with ViewAllModal
type ViewAllMedication = Medication & ItemType & { id: string };

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
  const [selectedMedication, setSelectedMedication] =
    useState<Medication | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (medications.length > 0) {
      setIsViewAllModalOpen(true);
    } else if (onViewAll) {
      onViewAll();
    } else {
      navigate("/medications");
    }
  };

  const handleMedicationClick = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsDetailModalOpen(true);
  };

  const getDetails = (med: Medication): { label: string; value: string }[] => [
    { label: "Name", value: med.name },
    { label: "Dosage", value: med.dosage },
    { label: "Frequency", value: med.frequency },
    { label: "Start Date", value: med.startDate || "Not specified" },
    { label: "End Date", value: med.endDate || "Not specified" },
    { label: "Prescribed By", value: med.prescribedBy || "Not specified" },
    { label: "Notes", value: med.notes || "No additional notes" },
  ];

  const renderMedicationItem = (medication: Medication) => {
    return (
      <div
        key={medication.id}
        className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
        onClick={() => {
          setSelectedMedication(medication);
          setIsDetailModalOpen(true);
          setIsViewAllModalOpen(false);
        }}
      >
        <div className="flex items-start">
          <div className="bg-purple-50 p-2 rounded-lg mr-3">
            {medication.icon || <Pill className="h-5 w-5 text-purple-500" />}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{medication.name}</p>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span>Start: {medication.startDate || "No start date"}</span>
              {medication.endDate && (
                <span className="ml-2">• End: {medication.endDate}</span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {medication.dosage} • {medication.frequency}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const displayedMedications = medications.slice(0, 3);
  const hasMoreItems = medications.length > 3;

  return (
    <>
      <div
        className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Medications</h3>
          {hasMoreItems && (
            <button
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={handleViewAll}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "View All"}
            </button>
          )}
        </div>
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Loading medications...
            </div>
          ) : displayedMedications.length > 0 ? (
            displayedMedications.map((medication) => (
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
            <div className="p-4 text-center text-gray-500">
              No medications found
            </div>
          )}
        </div>
      </div>

      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedMedication?.name || "Medication Details"}
        description={`Details for ${
          selectedMedication?.name || "this medication"
        }`}
        details={selectedMedication ? getDetails(selectedMedication) : []}
      />

      <ViewAllModal
        isOpen={isViewAllModalOpen}
        onClose={() => setIsViewAllModalOpen(false)}
        title="All Medications"
        items={
          medications.map((m) => ({
            ...m,
            name: m.name,
            [Symbol.iterator]: undefined, // Remove any non-serializable properties
          })) as ViewAllMedication[]
        }
        renderItem={renderMedicationItem}
        emptyMessage="No medications found"
      />
    </>
  );
};
