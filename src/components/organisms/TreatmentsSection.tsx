import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TreatmentCard } from "../molecules/TreatmentCard";
import { DetailModal } from "./DetailModal";
import { ViewAllModal, type ItemType } from "./ViewAllModal";
import type {
  TreatmentItem,
  TreatmentsSectionProps,
} from "@/features/pets/types/treatment";
import { Calendar, Stethoscope } from "lucide-react";

type ViewAllItem = TreatmentItem &
  ItemType & {
    id: string | number;
    name: string;
    administered_at: string;
    icon: React.ReactNode;
    category?: string;
    notes?: string;
  };

export const TreatmentsSection = ({
  treatments = [],
  onViewAll,
  isLoading = false,
  className = "",
}: TreatmentsSectionProps) => {
  const navigate = useNavigate();
  const [selectedTreatment, setSelectedTreatment] =
    useState<TreatmentItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (treatments.length > 0) {
      setIsViewAllModalOpen(true);
    } else if (onViewAll) {
      onViewAll();
    } else {
      navigate("/treatments");
    }
  };

  const handleTreatmentClick = (treatment: TreatmentItem) => {
    setSelectedTreatment(treatment);
    setIsDetailModalOpen(true);
  };

  const getDetails = (treatment: TreatmentItem) => [
    { label: "Name", value: treatment.name },
    { label: "Date", value: treatment.administered_at || "Not specified" },
    { label: "Category", value: treatment.category || "Not specified" },
    { label: "Notes", value: treatment.notes || "No additional notes" },
  ];

  const renderTreatmentItem = (treatment: ViewAllItem) => {
    const treatmentItem = treatment as unknown as TreatmentItem;
    return (
      <div
        key={treatment.id}
        className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
        onClick={() => {
          setSelectedTreatment(treatmentItem);
          setIsDetailModalOpen(true);
          setIsViewAllModalOpen(false);
        }}
      >
        <div className="flex items-start">
          <div className="bg-blue-50 p-2 rounded-lg mr-3">
            {treatmentItem.icon || (
              <Stethoscope className="h-5 w-5 text-blue-500" />
            )}
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">{treatmentItem.name}</p>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span>{treatmentItem.administered_at || "No date"}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {treatmentItem.vet} • {treatmentItem.category}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const displayedTreatments = treatments.slice(0, 3);
  const hasMoreItems = treatments.length > 3;

  return (
    <>
      <div
        className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}
      >
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Treatments</h3>
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
              Loading treatments...
            </div>
          ) : displayedTreatments.length > 0 ? (
            displayedTreatments.map((treatment) => (
              <div
                key={treatment.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleTreatmentClick(treatment)}
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
              <div className="flex flex-col items-center justify-center space-y-3">
                <Stethoscope className="h-12 w-12 text-gray-300" />
                <h4 className="text-gray-500 font-medium">
                  No treatments found
                </h4>
              </div>
            </div>
          )}
        </div>
      </div>

      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedTreatment?.name || "Treatment Details"}
        description={`Administered on ${
          selectedTreatment?.administered_at || "unknown date"
        }`}
        details={selectedTreatment ? getDetails(selectedTreatment) : []}
      />

      <ViewAllModal
        isOpen={isViewAllModalOpen}
        onClose={() => setIsViewAllModalOpen(false)}
        title="All Treatments"
        items={
          treatments.map((t) => ({
            ...t,
            name: t.name,
            [Symbol.iterator]: undefined, // Remove any non-serializable properties
          })) as ViewAllItem[]
        }
        renderItem={renderTreatmentItem}
        emptyMessage="No treatments found"
      />
    </>
  );
};
