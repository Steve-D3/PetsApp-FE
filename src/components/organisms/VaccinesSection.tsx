import { ShieldCheck, Calendar, Syringe } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import type { Vaccination } from "@/features/pets/types";

type VaccinesSectionProps = {
  vaccines: Vaccination[];
  onViewAll: () => void;
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
  vaccines,
  onViewAll,
}: VaccinesSectionProps) => {
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Vaccinations</h3>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewAll}
              className="text-sm text-blue-600 hover:bg-blue-50"
            >
              View All
            </Button>
          </div>
        </div>
      </div>
      <div className="p-0">
        {vaccines.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p>No vaccination records found.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {vaccines.map((vaccine) => (
              <li key={vaccine.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-blue-50">
                      <Syringe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {vaccine.vaccination_type?.name || "Unknown Vaccine"}
                      </h4>
                      {vaccine.administration_date && (
                        <p className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          Last: {formatDate(vaccine.administration_date)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${getStatusBadge(
                        vaccine.next_due_date
                      )}`}
                    >
                      {getStatusText(vaccine.next_due_date)}
                    </span>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Next Due</p>
                      <p className="text-sm font-medium">
                        {formatDate(vaccine.next_due_date)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
