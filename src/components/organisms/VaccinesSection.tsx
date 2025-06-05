import { useState } from "react";
import { ShieldCheck, Calendar, Syringe } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import type { Vaccination } from "@/features/pets/types";
import { DetailModal } from "./DetailModal";
import { ViewAllModal, type ItemType } from "./ViewAllModal";

// Extend ItemType to ensure compatibility with ViewAllModal
type ViewAllVaccine = Vaccination & ItemType & { id: string | number };

type VaccinesSectionProps = {
  vaccines: Vaccination[];
  onViewAll: () => void;
  onEditVaccine?: never;
  onDeleteVaccine?: never;
  isLoading?: boolean;
};

// const getStatusBadge = (dueDateString: string | null) => {
//   if (!dueDateString) return 'bg-gray-100 text-gray-800';

//   const dueDate = new Date(dueDateString);
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   if (isNaN(dueDate.getTime())) return 'bg-gray-100 text-gray-800';
//   if (dueDate < today) return 'bg-red-100 text-red-800';
//   if (dueDate <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) {
//     return 'bg-yellow-100 text-yellow-800';
//   }
//   return 'bg-green-100 text-green-800';
// };

const getStatusText = (dueDateString: string | null) => {
  if (!dueDateString) return "No Date";

  const dueDate = new Date(dueDateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(dueDate.getTime())) return "No Date";
  if (dueDate < today) return "Overdue";
  if (dueDate <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) {
    return "Due Soon";
  }
  return "Up to Date";
};

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString();
};

export const VaccinesSection = ({
  vaccines = [],
  onViewAll,
  isLoading = false,
}: VaccinesSectionProps) => {
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccination | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isViewAllModalOpen, setIsViewAllModalOpen] = useState(false);

  const handleViewAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (vaccines.length > 0) {
      setIsViewAllModalOpen(true);
    } else if (onViewAll) {
      onViewAll();
    }
  };

  const handleVaccineClick = (vaccine: Vaccination) => {
    setSelectedVaccine(vaccine);
    setIsDetailModalOpen(true);
  };

  const getDetails = (vaccine: Vaccination) => [
    { label: 'Vaccine', value: vaccine.vaccination_type?.name || 'Unknown' },
    { label: 'Manufacturer', value: vaccine.manufacturer || 'Not specified' },
    { label: 'Batch Number', value: vaccine.batch_number || 'Not specified' },
    { label: 'Administered On', value: formatDate(vaccine.administration_date) },
    { label: 'Expires On', value: formatDate(vaccine.expiration_date) },
    { label: 'Next Due', value: formatDate(vaccine.next_due_date) },
    { label: 'Status', value: getStatusText(vaccine.next_due_date) },
    { label: 'Administered By', value: vaccine.administered_by ? `Vet #${vaccine.administered_by}` : 'Not specified' },
    { label: 'Notes', value: vaccine.notes || 'No notes available' },
  ];

  const renderVaccineItem = (vaccine: ViewAllVaccine) => {
    const vaccineItem = vaccine as unknown as Vaccination;
    return (
      <div 
        key={vaccine.id}
        className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
        onClick={() => {
          setSelectedVaccine(vaccineItem);
          setIsDetailModalOpen(true);
          setIsViewAllModalOpen(false);
        }}
      >
        <div className="flex items-start">
          <div className="bg-green-50 p-2 rounded-lg mr-3">
            <ShieldCheck className="h-5 w-5 text-green-500" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {vaccineItem.vaccination_type?.name || 'Vaccine'}
            </p>
            <div className="flex items-center mt-1 text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span>Administered: {formatDate(vaccineItem.administration_date) || 'No date'}</span>
            </div>
            <div className="flex items-center mt-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                getStatusBadge(getStatusText(vaccineItem.next_due_date))
              }`}>
                {getStatusText(vaccineItem.next_due_date)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const displayedVaccines = vaccines.slice(0, 3);
  const hasMoreItems = vaccines.length > 3;
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Vaccinations</h3>
          {hasMoreItems && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleViewAll}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'View All'}
            </Button>
          )}
        </div>
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading vaccinations...</div>
          ) : displayedVaccines.length > 0 ? (
            displayedVaccines.map((vaccine) => (
              <div
                key={vaccine.id}
                className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => handleVaccineClick(vaccine)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-blue-50">
                      <ShieldCheck className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {vaccine.vaccination_type?.name || "Vaccine"}
                      </h4>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1.5" />
                        <span>{formatDate(vaccine.administration_date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                        getStatusText(vaccine.next_due_date)
                      )}`}
                    >
                      {getStatusText(vaccine.next_due_date)}
                    </span>
                  </div>
                </div>
                {vaccine.next_due_date && (
                  <div className="mt-2 text-sm text-gray-500 flex items-center">
                    <Syringe className="h-4 w-4 mr-1.5 text-gray-400" />
                    <span>Next due: {formatDate(vaccine.next_due_date)}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No vaccination records found
            </div>
          )}
        </div>
      </div>

      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedVaccine?.vaccination_type?.name || 'Vaccine Details'}
        description={`Administered on ${selectedVaccine?.administration_date ? formatDate(selectedVaccine.administration_date) : 'unknown date'}`}
        details={selectedVaccine ? getDetails(selectedVaccine) : []}
      />

      <ViewAllModal
        isOpen={isViewAllModalOpen}
        onClose={() => setIsViewAllModalOpen(false)}
        title="All Vaccinations"
        items={vaccines.map(v => ({
          ...v,
          name: v.vaccination_type?.name || 'Vaccine',
          [Symbol.iterator]: undefined // Remove any non-serializable properties
        })) as ViewAllVaccine[]}
        renderItem={renderVaccineItem}
        emptyMessage="No vaccinations found"
      />
    </>
  );
};
