import { ShieldCheck, Calendar, Syringe } from "lucide-react";
import { Button } from "@/components/atoms/Button";

type Vaccine = {
  id: string;
  name: string;
  nextDue: string;
  status: "upcoming" | "overdue" | "completed";
  lastAdministered?: string;
};

type VaccinesSectionProps = {
  vaccines: Vaccine[];
  onViewAll: () => void;
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
                        {vaccine.name}
                      </h4>
                      {vaccine.lastAdministered && (
                        <p className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          Last: {vaccine.lastAdministered}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full ${getStatusBadge(
                        vaccine.status
                      )}`}
                    >
                      {vaccine.status.charAt(0).toUpperCase() +
                        vaccine.status.slice(1)}
                    </span>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Next Due</p>
                      <p className="text-sm font-medium">{vaccine.nextDue}</p>
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
